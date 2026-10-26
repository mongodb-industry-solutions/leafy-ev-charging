import { ObjectId, type Db, type Document } from "mongodb";
import type { ChargingStationDoc } from "../../src/db/repositories/chargingStations";
import { summarizeTelemetry } from "../../src/db/repositories/telemetry";

type IncidentOverview = {
  total: number;
  byType: Array<{ type: string; count: number }>;
  bySeverity: Array<{ severity: string; count: number }>;
  recent: Array<{
    stationId: string;
    type: string;
    severity: string;
    status: string;
    description: string;
    resolutionNotes: string | null;
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
            status: 1,
            description: 1,
            resolutionNotes: { $ifNull: ["$resolution.notes", null] },
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

const ADDRESS_FIELDS = [
  "address.street",
  "address.city",
  "address.postalCode",
  "address.country"
] as const;

function _escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function _exactQuery(value: string): Document {
  const match = { $regex: `^${_escapeRegExp(value)}$`, $options: "i" };
  return {
    $or: [{ name: match }, { operator: match }, { stationCode: match }]
  };
}

function _addressQuery(parts: string[]): Document {
  return {
    $and: parts.map((part) => ({
      $or: ADDRESS_FIELDS.map((field) => ({
        [field]: { $regex: _escapeRegExp(part), $options: "i" }
      }))
    }))
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

export type SkimTelemetryInput = {
  sessionId?: string;
  chargingPointId?: string;
  stationId?: string;
  from: string;
  to: string;
  limit?: number;
};

export async function skimTelemetry(db: Db, input: SkimTelemetryInput) {
  return summarizeTelemetry(db, {
    sessionId: input.sessionId,
    chargingPointId: input.chargingPointId,
    stationId: input.stationId,
    from: new Date(input.from),
    to: new Date(input.to),
    limit: input.limit,
  });
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

export type SearchManualsInput = {
  query: string;
  codes?: string[];
  limit?: number;
};

export type ManualChunkResult = {
  section: string;
  heading: string;
  codes: string[];
  text: string;
  score: number | null;
};

const VOYAGE_EMBEDDINGS_URL = "https://api.voyageai.com/v1/embeddings";
const MANUAL_COLLECTION = "manualChunks";
const MANUAL_VECTOR_INDEX = "default";
const MANUAL_LEXICAL_INDEX = "lexical";
const DEFAULT_VOYAGE_MODEL = "voyage-3.5";

async function embedManualQuery(
  query: string,
  model: string
): Promise<number[] | null> {
  const apiKey = process.env.VOYAGE_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(VOYAGE_EMBEDDINGS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: [query], model, input_type: "query" })
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    const embedding = payload.data?.[0]?.embedding;
    return Array.isArray(embedding) ? embedding : null;
  } catch {
    return null;
  }
}

export async function searchManuals(
  db: Db,
  input: SearchManualsInput
): Promise<{ results: ManualChunkResult[] }> {
  const query = input.query.trim();
  if (!query) throw new Error("query is required");

  const limit = input.limit ?? 5;
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) {
    throw new Error("limit must be an integer between 1 and 20");
  }

  const collection = db.collection(MANUAL_COLLECTION);

  let model = process.env.VOYAGE_MODEL ?? DEFAULT_VOYAGE_MODEL;
  const sample = await collection.findOne(
    {},
    { projection: { embeddingModel: 1 } }
  );
  if (sample && typeof sample.embeddingModel === "string") {
    model = sample.embeddingModel;
  }

  const filter =
    input.codes && input.codes.length > 0
      ? { codes: { $in: input.codes } }
      : undefined;

  const queryVector = await embedManualQuery(query, model);
  if (queryVector) {
    try {
      const results = await collection
        .aggregate<ManualChunkResult>([
          {
            $vectorSearch: {
              index: MANUAL_VECTOR_INDEX,
              path: "embedding",
              queryVector,
              numCandidates: Math.max(limit * 10, 50),
              limit,
              ...(filter ? { filter } : {})
            }
          },
          {
            $project: {
              _id: 0,
              section: 1,
              heading: 1,
              codes: 1,
              text: 1,
              score: { $meta: "vectorSearchScore" }
            }
          }
        ])
        .toArray();
      if (results.length > 0) return { results };
    } catch {
      // Atlas Vector Search unavailable; fall back to lexical search.
    }
  }

  try {
    const results = await collection
      .aggregate<ManualChunkResult>([
        {
          $search: {
            index: MANUAL_LEXICAL_INDEX,
            compound: {
              should: [
                { text: { query, path: ["text", "heading"] } },
                ...(input.codes ?? []).map((code) => ({
                  equals: { path: "codes", value: code }
                }))
              ],
              minimumShouldMatch: 1
            }
          }
        },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            section: 1,
            heading: 1,
            codes: 1,
            text: 1,
            score: { $meta: "searchScore" }
          }
        }
      ])
      .toArray();
    return { results };
  } catch {
    return { results: [] };
  }
}