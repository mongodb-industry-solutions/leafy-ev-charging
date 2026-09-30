import { ObjectId, type Db, type Document } from "mongodb";
import type { ChargingStationDoc } from "../../src/db/repositories/chargingStations";

type IncidentOverview = {
  total: number;
  byType: Array<{ type: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
  recent: Array<{
    stationId: string;
    type: string;
    severity: string;
    description: string;
    createdAt: Date;
  }>;
};

type IncidentFacetResult = {
  summary: Array<{ total: number }>;
  byType: IncidentOverview["byType"];
  bySeverity: IncidentOverview["bySeverity"];
  recent: IncidentOverview["recent"];
};

function _parseObjectId(value: string): ObjectId {
  if (!/^[a-fA-F0-9]{24}$/.test(value)) throw new Error("Invalid ID");
  return new ObjectId(value);
}

async function runIncidentSummary(
  db: Db,
  stationId?: string
): Promise<IncidentOverview> {
  const pipeline: Document[] = [];

  if (stationId !== undefined) {
    if (!/^[a-fA-F0-9]{24}$/.test(stationId)) {
      throw new Error("stationId must be a valid MongoDB ObjectId");
    }
    pipeline.push({ $match: { stationId: new ObjectId(stationId) } });
  }

  pipeline.push({
    $facet: {
      summary: [
        { $group: { _id: null, total: { $sum: 1 } } },
        { $project: { _id: 0, total: 1 } }
      ],
      byType: [
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $project: { _id: 0, type: "$_id", count: 1 } },
        { $sort: { count: -1 } }
      ],
      bySeverity: [
        { $group: { _id: "$severity", count: { $sum: 1 } } },
        { $project: { _id: 0, severity: "$_id", count: 1 } },
        { $sort: { count: -1 } }
      ],
      recent: [
        { $sort: { createdAt: -1 } },
        { $limit: 30 },
        {
          $project: {
            _id: 0,
            stationId: { $toString: "$stationId" },
            type: 1,
            severity: 1,
            description: 1,
            createdAt: 1
          }
        }
      ]
    }
  });

  const [result] = await db
    .collection("incidents")
    .aggregate<IncidentFacetResult>(pipeline)
    .toArray();

    console.log(
        result
    )

  return {
    total: result?.summary[0]?.total ?? 0,
    byType: result?.byType ?? [],
    bySeverity: result?.bySeverity ?? [],
    recent: result?.recent ?? []
  };
}

export async function summarizeIncidents(db: Db): Promise<IncidentOverview> {
  return runIncidentSummary(db);
}

export async function summarizeStationIncidents(
  db: Db,
  stationId: string
): Promise<IncidentOverview> {
  if (!/^[a-fA-F0-9]{24}$/.test(stationId)) {
    throw new Error("stationId must be a valid MongoDB ObjectId");
  }

  return runIncidentSummary(db, stationId);
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

export type ChargingActivityRankInput = {
  from: string;
  to: string;
  metric: "revenue" | "energy" | "sessions";
  groupBy: "station" | "chargingPoint";
  limit?: number;
};

type ChargingActivityRankRow = {
  _id: {
    targetId: ObjectId;
    targetName: string | null;
    currency: string | null;
  };
  sessions: number;
  energyKwh: number;
  revenueCents: number;
};

export async function rankChargingActivity(
  db: Db,
  input: ChargingActivityRankInput
) {
  const from = new Date(input.from);
  const to = new Date(input.to);
  const limit = input.limit ?? 5;

  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from >= to) {
    throw new Error("Provide a valid date range with from earlier than to");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
    throw new Error("limit must be an integer between 1 and 10");
  }

  const targetIdField = input.groupBy === "station" ? "$stationId" : "$chargingPointId";
  const targetNameField = input.groupBy === "station"
    ? "$stationSnapshot.name"
    : "$stationSnapshot.chargingPointLabel";
  const metricField = ({
    revenue: "revenueCents",
    energy: "energyKwh",
    sessions: "sessions"
  } as const)[input.metric];
  const pipeline: Document[] = [
    {
      $match: {
        "charging.startedAt": { $gte: from, $lt: to }
      }
    },
    {
      $group: {
        _id: {
          targetId: targetIdField,
          targetName: targetNameField,
          currency: input.metric === "revenue"
            ? { $ifNull: ["$pricingSnapshot.currency", "UNKNOWN"] }
            : null
        },
        sessions: { $sum: 1 },
        energyKwh: {
          $sum: { $ifNull: ["$charging.energyDeliveredKwh", 0] }
        },
        revenueCents: { $sum: { $ifNull: ["$cost.totalCents", 0] } }
      }
    }
  ];

  const rows = await db
    .collection("chargingSessions")
    .aggregate<ChargingActivityRankRow>(pipeline, { maxTimeMS: 5000 })
    .toArray();

  const byCurrency = new Map<string, ChargingActivityRankRow[]>();
  for (const row of rows) {
    const currency = input.metric === "revenue" ? row._id.currency ?? "UNKNOWN" : "";
    const group = byCurrency.get(currency) ?? [];
    group.push(row);
    byCurrency.set(currency, group);
  }

  const rankings = [...byCurrency.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .flatMap(([currency, group]) =>
      group
        .sort((left, right) => right[metricField] - left[metricField])
        .slice(0, limit)
        .map((row, index) => ({
          rank: index + 1,
          id: row._id.targetId.toHexString(),
          name: row._id.targetName,
          ...(input.metric === "revenue" ? { currency } : {}),
          sessions: row.sessions,
          energyKwh: row.energyKwh,
          revenueCents: row.revenueCents
        }))
    );

  console.log("Generated rankings:", rankings);

  return {
    from: from.toISOString(),
    to: to.toISOString(),
    metric: input.metric,
    groupBy: input.groupBy,
    rankings
  };
}