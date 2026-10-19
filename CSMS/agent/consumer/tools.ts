import { ObjectId, type Db, type Document } from "mongodb";
import {
  buildAddressMatch,
  type ChargingStationDoc,
  type StationAddressFilter,
} from "../../src/db/repositories/chargingStations";
import { buildSharedHistoryMatch } from "../../src/db/repositories/chargingSessions";

const STATION_SORTS = {
  price: { field: "pricing.defaultTariff.priceCentsPerKwh", direction: 1 },
  power: { field: "maxPowerKw", direction: -1 },
  availability: { field: "availableNowPoints", direction: -1 },
  name: { field: "name", direction: 1 },
  open24h: { field: "isOpen24h", direction: -1 },
  freshness: { field: "availabilityComputedAt", direction: -1 },
} as const;

export type AreaSearch = {
  longitude: number;
  latitude: number;
  radiusMeters: number;
};

export type LocationSearch = Partial<AreaSearch> & StationAddressFilter;

export type StationSearchCriteria = {
  stationIds?: string[];
  sortBy: keyof typeof STATION_SORTS;
  availableOnly?: boolean;
  minPowerKw?: number;
  maxPriceCentsPerKwh?: number;
  currency?: string;
  limit?: number;
};

export type StationSearchResult = {
  stationId: string;
  stationCode: string;
  name: string;
  operator: string | null;
  location: ChargingStationDoc["location"];
  address: NonNullable<ChargingStationDoc["address"]> | null;
  timezone: string | null;
  characteristics: NonNullable<ChargingStationDoc["characteristics"]> | null;
  availabilityComputedAt: Date | null;
  updatedAt: Date | null;
  priceCentsPerKwh: number | null;
  currency: string | null;
  maxPowerKw: number;
  availableNowPoints: number;
  chargingPoints: Array<{
    chargingPointId: string;
    availableNow: boolean;
    connectors: ChargingStationDoc["chargingPoints"][number]["connectors"];
  }>;
};

function _parseObjectId(value: string): ObjectId {
  if (!/^[a-fA-F0-9]{24}$/.test(value)) throw new Error("Invalid ID");
  return new ObjectId(value);
}

// Cap on nearby stations returned to the model. If more match, the result
// is flagged truncated instead of failing the call.
const AREA_RESULT_CAP = 1000;

function _hasCoordinates(location: LocationSearch): boolean {
  return (
    location.longitude !== undefined ||
    location.latitude !== undefined ||
    location.radiusMeters !== undefined
  );
}

function _parseArea(location: LocationSearch): AreaSearch {
  const { longitude, latitude, radiusMeters } = location;
  if (
    longitude === undefined ||
    latitude === undefined ||
    radiusMeters === undefined
  ) {
    throw new Error("Provide longitude, latitude, and radiusMeters together");
  }
  if (
    ![longitude, latitude, radiusMeters].every(Number.isFinite) ||
    Math.abs(longitude) > 180 ||
    Math.abs(latitude) > 90 ||
    radiusMeters <= 0 ||
    radiusMeters > 100000
  ) {
    throw new Error("Invalid coordinates or radius; maximum radius is 100 km");
  }
  return { longitude, latitude, radiusMeters };
}

const EARTH_RADIUS_METERS = 6371000;

function _haversineMeters(
  origin: { longitude: number; latitude: number },
  point: [number, number],
): number {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const deltaLat = toRadians(point[1] - origin.latitude);
  const deltaLng = toRadians(point[0] - origin.longitude);
  const lat1 = toRadians(origin.latitude);
  const lat2 = toRadians(point[1]);
  const h =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type NearbyStation = { stationId: string; distanceMeters: number };

export type AreaSearchResult = {
  stations: NearbyStation[];
  area: AreaSearch | null;
  truncated: boolean;
};

export async function findChargingStationsInArea(
  db: Db,
  location: LocationSearch,
): Promise<AreaSearchResult> {
  if (_hasCoordinates(location)) {
    const area = _parseArea(location);
    const rows = await db
      .collection("chargingStations")
      .aggregate<{ _id: ObjectId; distanceMeters: number }>(
        [
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [area.longitude, area.latitude],
              },
              distanceField: "distanceMeters",
              maxDistance: area.radiusMeters,
              key: "location",
              spherical: true,
            },
          },
          { $limit: AREA_RESULT_CAP + 1 },
          { $project: { _id: 1, distanceMeters: 1 } },
        ],
        { maxTimeMS: 5000 },
      )
      .toArray();

    return {
      stations: rows.slice(0, AREA_RESULT_CAP).map((row) => ({
        stationId: String(row._id),
        distanceMeters: row.distanceMeters,
      })),
      area,
      truncated: rows.length > AREA_RESULT_CAP,
    };
  }

  const addressMatch = buildAddressMatch(location);
  if (Object.keys(addressMatch).length === 0) {
    throw new Error(
      "Provide coordinates or at least one address field (street, city, country, postalCode)",
    );
  }

  const matches = await db
    .collection<ChargingStationDoc>("chargingStations")
    .find(addressMatch, {
      projection: { _id: 1, location: 1 },
      maxTimeMS: 5000,
    })
    .limit(AREA_RESULT_CAP + 1)
    .toArray();

  if (matches.length === 0) {
    return { stations: [], area: null, truncated: false };
  }

  const capped = matches.slice(0, AREA_RESULT_CAP);
  const centroid = {
    longitude:
      capped.reduce(
        (sum, station) => sum + station.location.coordinates[0],
        0,
      ) / capped.length,
    latitude:
      capped.reduce(
        (sum, station) => sum + station.location.coordinates[1],
        0,
      ) / capped.length,
  };

  const stations = capped.map((station) => ({
    stationId: String(station._id),
    distanceMeters: Math.round(
      _haversineMeters(centroid, station.location.coordinates),
    ),
  }));

  return {
    stations,
    area: {
      longitude: centroid.longitude,
      latitude: centroid.latitude,
      radiusMeters: stations.reduce(
        (max, station) => Math.max(max, station.distanceMeters),
        0,
      ),
    },
    truncated: matches.length > AREA_RESULT_CAP,
  };
}

export async function findChargingStation(
  db: Db,
  criteria: StationSearchCriteria,
): Promise<StationSearchResult[]> {
  const {
    stationIds,
    sortBy,
    availableOnly = false,
    minPowerKw = 0,
    maxPriceCentsPerKwh,
    limit = 3,
  } = criteria;
  const currency = criteria.currency?.trim().toUpperCase();

  if (
        stationIds !== undefined &&
        (!Array.isArray(stationIds) ||
        stationIds.some(
            (id) => typeof id !== "string" || !/^[a-fA-F0-9]{24}$/.test(id),
        ))
  ) {
    throw new Error("stationIds must contain valid MongoDB ObjectId strings");
  }
  if (!Object.hasOwn(STATION_SORTS, sortBy)) {
    throw new Error(
      `sortBy must be one of: ${Object.keys(STATION_SORTS).join(", ")}`,
    );
  }
  if (
    typeof availableOnly !== "boolean" ||
    !Number.isFinite(minPowerKw) ||
    minPowerKw < 0
  ) {
    throw new Error("Invalid availability or minimum power filter");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
    throw new Error("limit must be an integer between 1 and 10");
  }
  if (
    maxPriceCentsPerKwh !== undefined &&
    (!Number.isSafeInteger(maxPriceCentsPerKwh) || maxPriceCentsPerKwh < 0)
  ) {
    throw new Error("Maximum price must be a nonnegative integer in cents");
  }
  if (currency !== undefined && !/^[A-Z]{3}$/.test(currency)) {
    throw new Error("currency must be a three-letter currency code");
  }
  if ((sortBy === "price" || maxPriceCentsPerKwh !== undefined) && !currency) {
    throw new Error("Specify currency when sorting or filtering by price");
  }
  if (stationIds !== undefined && stationIds.length === 0) return [];

  const priceMatch: Document = {};
  if (currency) priceMatch["pricing.currency"] = currency;
  if (sortBy === "price" || maxPriceCentsPerKwh !== undefined) {
    priceMatch["pricing.defaultTariff.priceCentsPerKwh"] = {
      $type: "number",
      $gte: 0,
      ...(maxPriceCentsPerKwh !== undefined
        ? { $lte: maxPriceCentsPerKwh }
        : {}),
    };
  }

  // Match usable charging points before $unwind so fewer documents expand.
  const pointMatch: Document = { outOfService: { $ne: true } };
  if (availableOnly) pointMatch["availableNow"] = true;

  const sort = STATION_SORTS[sortBy];

  const pipeline: Document[] = [
    {
      $match: {
        // Omitted stationIds means a network-wide search.
        ...(stationIds
          ? {
              _id: {
                $in: [...new Set(stationIds)].map((id) => new ObjectId(id)),
              },
            }
          : {}),
        ...priceMatch,
        // Match usable charging points before $unwind so fewer documents expand.
        chargingPoints: { $elemMatch: pointMatch },
      },
    },
    { $unwind: "$chargingPoints" },
    {
      $match: {
        "chargingPoints.outOfService": { $ne: true },
        ...(availableOnly ? { "chargingPoints.availableNow": true } : {}),
      },
    },
    {
      $set: {
        "chargingPoints.connectors": {
          $filter: {
            input: { $ifNull: ["$chargingPoints.connectors", []] },
            as: "connector",
            cond: {
              $and: [
                { $isNumber: "$$connector.power" },
                { $gt: ["$$connector.power", 0] },
                { $gte: ["$$connector.power", minPowerKw] },
              ],
            },
          },
        },
      },
    },
    { $match: { "chargingPoints.connectors.0": { $exists: true } } },
    {
      $group: {
        _id: "$_id",
        stationCode: { $first: "$stationCode" },
        name: { $first: "$name" },
        operator: { $first: "$operator" },
        location: { $first: "$location" },
        address: { $first: "$address" },
        timezone: { $first: "$timezone" },
        characteristics: { $first: "$characteristics" },
        availabilityComputedAt: { $first: "$availability.lastComputedAt" },
        updatedAt: { $first: "$updatedAt" },
        isOpen24h: {
          $first: {
            $cond: [{ $eq: ["$characteristics.access.open24h", true] }, 1, 0],
          },
        },
        pricing: { $first: "$pricing" },
        chargingPoints: {
          $push: {
            chargingPointId: { $toString: "$chargingPoints.chargingPointId" },
            availableNow: { $eq: ["$chargingPoints.availableNow", true] },
            connectors: "$chargingPoints.connectors",
          },
        },
        maxPowerKw: { $max: { $max: "$chargingPoints.connectors.power" } },
        availableNowPoints: {
          $sum: {
            $cond: [{ $eq: ["$chargingPoints.availableNow", true] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: {
        [sort.field]: sort.direction,
        _id: 1,
      },
    },
    { $limit: limit },
    {
      $project: {
        _id: 0,
        stationId: { $toString: "$_id" },
        stationCode: 1,
        name: 1,
        operator: { $ifNull: ["$operator", null] },
        location: 1,
        address: { $ifNull: ["$address", null] },
        timezone: { $ifNull: ["$timezone", null] },
        characteristics: { $ifNull: ["$characteristics", null] },
        availabilityComputedAt: { $ifNull: ["$availabilityComputedAt", null] },
        updatedAt: { $ifNull: ["$updatedAt", null] },
        priceCentsPerKwh: {
          $ifNull: ["$pricing.defaultTariff.priceCentsPerKwh", null],
        },
        currency: { $ifNull: ["$pricing.currency", null] },
        maxPowerKw: 1,
        availableNowPoints: 1,
        chargingPoints: 1,
      },
    },
  ];

  return db
    .collection("chargingStations")
    .aggregate<StationSearchResult>(pipeline, { maxTimeMS: 5000 })
    .toArray();
}

const ADDRESS_FIELDS = [
  "address.street",
  "address.city",
  "address.postalCode",
  "address.country",
] as const;

function _escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function _exactQuery(value: string): Document {
  const match = { $regex: `^${_escapeRegExp(value)}$`, $options: "i" };
  return {
    $or: [{ name: match }, { operator: match }, { stationCode: match }],
  };
}

function _addressQuery(parts: string[]): Document {
  return {
    $and: parts.map((part) => ({
      $or: ADDRESS_FIELDS.map((field) => ({
        [field]: { $regex: _escapeRegExp(part), $options: "i" },
      })),
    })),
  };
}

export async function getSelectedChargerDetails(db: Db, stationId: string) {
  const collection = db.collection<ChargingStationDoc>("chargingStations");
  const options = {
    maxTimeMS: 5000,
    projection: {
      stationCode: 1,
      name: 1,
      operator: 1,
      location: 1,
      address: 1,
      timezone: 1,
      characteristics: 1,
      chargingPoints: 1,
      pricing: 1,
      availability: 1,
      updatedAt: 1,
    },
  };

  if (/^[a-fA-F0-9]{24}$/.test(stationId)) {
    return collection.findOne({ _id: _parseObjectId(stationId) }, options);
  }

  const query = stationId.trim();
  if (!query) return null;

  const findMatches = (filter: Document) =>
    collection.find(filter, options).limit(10).toArray();

  let matches: ChargingStationDoc[];
  if (query.includes(",")) {
    const parts = query
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    matches = parts.length > 0 ? await findMatches(_addressQuery(parts)) : [];
    if (matches.length === 0) matches = await findMatches(_exactQuery(query));
  } else {
    matches = await findMatches(_exactQuery(query));
    if (matches.length === 0) matches = await findMatches(_addressQuery([query]));
  }

  if (matches.length === 0) return null;
  if (matches.length === 1) return matches[0];
  return matches;
}

export async function getMyChargingHistory(
  db: Db,
  userId: string,
  options: { mode: "current" | "recent" | "spending"; from: Date; to: Date },
) {
  const { mode, from, to } = options;
  if (
    !["current", "recent", "spending"].includes(mode) ||
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from >= to
  )
    throw new Error("Invalid history criteria");
  // Session-agnostic: match the caller's sessions plus the shared demo
  // history, so past sessions stay visible after a new session is loaded.
  const match: Document = buildSharedHistoryMatch(userId);
  if (mode === "current") match.status = { $in: ["ACTIVE", "BOOKED"] };
  else match["charging.endedAt"] = { $gte: from, $lt: to };
  if (mode === "spending") {
    match.status = "COMPLETED";
    match["cost.totalCents"] = { $type: "number", $gte: 0 };
    return db
      .collection("chargingSessions")
      .aggregate(
        [
          { $match: match },
          {
            $group: {
              _id: "$pricingSnapshot.currency",
              totalCents: { $sum: "$cost.totalCents" },
              sessions: { $sum: 1 },
            },
          },
        ],
        { maxTimeMS: 5000 },
      )
      .toArray();
  }
  return db
    .collection("chargingSessions")
    .find(match, {
      projection: {
        stationId: 1,
        chargingPointId: 1,
        stationSnapshot: 1,
        status: 1,
        booking: 1,
        charging: 1,
        cost: 1,
        pricingSnapshot: 1,
        updatedAt: 1,
      },
      maxTimeMS: 5000,
    })
    .sort({ "charging.endedAt": -1, updatedAt: -1, _id: -1 })
    .limit(10)
    .toArray();
}


