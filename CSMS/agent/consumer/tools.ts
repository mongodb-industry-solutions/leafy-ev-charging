import { ObjectId, type Db, type Document } from "mongodb";
import type { ChargingStationDoc } from "../../src/db/repositories/chargingStations";

const STATION_SORTS = {
  price: { field: "pricing.defaultTariff.priceCentsPerKwh", direction: 1 },
  power: { field: "maxPowerKw", direction: -1 },
  availability: { field: "availableNowPoints", direction: -1 },
  name: { field: "name", direction: 1 },
  open24h: { field: "isOpen24h", direction: -1 },
  freshness: { field: "availabilityComputedAt", direction: -1 },
} as const;

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
  if (stationIds === undefined || stationIds.length === 0) return [];

  const match: Document = {
    _id: { $in: [...new Set(stationIds ?? [])].map((id) => new ObjectId(id)) },
  };
  if (currency) match["pricing.currency"] = currency;
  if (sortBy === "price" || maxPriceCentsPerKwh !== undefined) {
    match["pricing.defaultTariff.priceCentsPerKwh"] = {
      $type: "number",
      $gte: 0,
      ...(maxPriceCentsPerKwh !== undefined
        ? { $lte: maxPriceCentsPerKwh }
        : {}),
    };
  }

  const sort = STATION_SORTS[sortBy];

  const pipeline: Document[] = [
    { $match: match },
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
    { $sort: { [sort.field]: sort.direction, _id: 1 } },
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

export async function findStationsInArea(
  db: Db,
  area: { longitude: number; latitude: number; radiusMeters: number },
) {
  const { longitude, latitude, radiusMeters } = area;
  if (
    ![longitude, latitude, radiusMeters].every(Number.isFinite) ||
    Math.abs(longitude) > 180 ||
    Math.abs(latitude) > 90 ||
    radiusMeters <= 0 ||
    radiusMeters > 100000
  ) {
    throw new Error("Invalid coordinates or radius; maximum radius is 100 km");
  }
  const stations = await db
    .collection("chargingStations")
    .find(
      {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radiusMeters,
          },
        },
      },
      {
        projection: { _id: 1 },
        maxTimeMS: 5000,
      },
    )
    .limit(1001)
    .toArray();

  if (stations.length > 1000) {
    throw new Error("Search area too large; narrow it");
  }

  return {
    stationIds: stations.map((station) => String(station._id)),
    area,
  };
}

export async function getSelectedChargerDetails(db: Db, stationId: string) {
  return db.collection<ChargingStationDoc>("chargingStations").findOne(
    { _id: _parseObjectId(stationId) },
    {
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
    },
  );
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
  const match: Document = { userId: _parseObjectId(userId) };
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


