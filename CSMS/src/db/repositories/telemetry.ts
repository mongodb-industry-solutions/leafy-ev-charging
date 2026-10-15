import { ObjectId, type Db } from "mongodb";

export type TelemetryEventType = "Started" | "Updated" | "Ended";

export type TelemetryDoc = {
  timestamp: Date;
  meta: {
    chargingPointId: ObjectId;
    stationId: ObjectId;
    sessionId: ObjectId;
    transactionId: string;
  };
  eventType: TelemetryEventType;
  powerKw: number | null;
  voltageV: number | null;
  currentA: number | null;
  energyKwh: number;
  energyKwhDelta: number;
  raw: unknown;
};

export type InsertTelemetryInput = {
  timestamp: Date;
  meta: TelemetryDoc["meta"];
  eventType: TelemetryEventType;
  energyKwh: number;
  energyKwhDelta: number;
  raw: unknown;
};

type TelemetryMeasurements = {
  powerKw: number | null;
  voltageV: number | null;
  currentA: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractMeasurements(raw: unknown): TelemetryMeasurements {
  const measurements: TelemetryMeasurements = {
    powerKw: null,
    voltageV: null,
    currentA: null,
  };

  if (!isRecord(raw) || !Array.isArray(raw.meterValue)) {
    return measurements;
  }

  for (const meterValue of raw.meterValue) {
    if (!isRecord(meterValue) || !Array.isArray(meterValue.sampledValue)) {
      continue;
    }

    for (const sample of meterValue.sampledValue) {
      if (!isRecord(sample)) {
        continue;
      }

      const value = toNumber(sample.value);
      if (value === null) {
        continue;
      }

      switch (sample.measurand) {
        case "Power.Active.Import":
          measurements.powerKw = value / 1000;
          break;
        case "Voltage":
          measurements.voltageV = value;
          break;
        case "Current.Import":
          measurements.currentA = value;
          break;
        default:
          break;
      }
    }
  }

  return measurements;
}

export async function insertTelemetrySample(
  database: Db,
  input: InsertTelemetryInput
): Promise<void> {
  const measurements = extractMeasurements(input.raw);

  await database.collection<TelemetryDoc>("telemetry").insertOne({
    timestamp: input.timestamp,
    meta: input.meta,
    eventType: input.eventType,
    powerKw: measurements.powerKw,
    voltageV: measurements.voltageV,
    currentA: measurements.currentA,
    energyKwh: input.energyKwh,
    energyKwhDelta: input.energyKwhDelta,
    raw: input.raw,
  });
}

export type TelemetryWindow = {
  sessionId?: string;
  chargingPointId?: string;
  stationId?: string;
  from: Date;
  to: Date;
  limit?: number;
};

export type TelemetrySample = {
  timestamp: Date;
  eventType: TelemetryEventType;
  powerKw: number | null;
  voltageV: number | null;
  currentA: number | null;
  energyKwh: number;
  energyKwhDelta: number;
};

type NumericStats = {
  min: number | null;
  max: number | null;
  avg: number | null;
};

export type TelemetrySummary = {
  from: Date;
  to: Date;
  sampleCount: number;
  powerKw: NumericStats;
  voltageV: NumericStats;
  currentA: NumericStats;
  energyKwhDeltaTotal: number;
  firstTimestamp: Date | null;
  lastTimestamp: Date | null;
  samples: TelemetrySample[];
};

const DEFAULT_SAMPLE_LIMIT = 100;
const MAX_SAMPLE_LIMIT = 500;

function buildMetaMatch(window: TelemetryWindow): Record<string, unknown> {
  const match: Record<string, unknown> = {};
  const keys = ["sessionId", "chargingPointId", "stationId"] as const;

  for (const key of keys) {
    const value = window[key];
    if (value === undefined) {
      continue;
    }
    if (!ObjectId.isValid(value)) {
      throw new Error(`${key} must be a valid MongoDB ObjectId string`);
    }
    match[`meta.${key}`] = new ObjectId(value);
  }

  if (Object.keys(match).length === 0) {
    throw new Error(
      "Provide at least one of sessionId, chargingPointId, or stationId"
    );
  }

  return match;
}

export async function summarizeTelemetry(
  database: Db,
  window: TelemetryWindow
): Promise<TelemetrySummary> {
  const { from, to } = window;
  if (
    !Number.isFinite(from.getTime()) ||
    !Number.isFinite(to.getTime()) ||
    from >= to
  ) {
    throw new Error("Provide a valid time window with from earlier than to");
  }

  const limit = window.limit ?? DEFAULT_SAMPLE_LIMIT;
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_SAMPLE_LIMIT) {
    throw new Error(`limit must be an integer between 1 and ${MAX_SAMPLE_LIMIT}`);
  }

  const match = {
    timestamp: { $gte: from, $lt: to },
    ...buildMetaMatch(window),
  };

  const collection = database.collection<TelemetryDoc>("telemetry");

  const [stats] = await collection
    .aggregate<{
      sampleCount: number;
      powerMin: number | null;
      powerMax: number | null;
      powerAvg: number | null;
      voltageMin: number | null;
      voltageMax: number | null;
      voltageAvg: number | null;
      currentMin: number | null;
      currentMax: number | null;
      currentAvg: number | null;
      energyKwhDeltaTotal: number;
      firstTimestamp: Date | null;
      lastTimestamp: Date | null;
    }>([
      { $match: match },
      {
        $group: {
          _id: null,
          sampleCount: { $sum: 1 },
          powerMin: { $min: "$powerKw" },
          powerMax: { $max: "$powerKw" },
          powerAvg: { $avg: "$powerKw" },
          voltageMin: { $min: "$voltageV" },
          voltageMax: { $max: "$voltageV" },
          voltageAvg: { $avg: "$voltageV" },
          currentMin: { $min: "$currentA" },
          currentMax: { $max: "$currentA" },
          currentAvg: { $avg: "$currentA" },
          energyKwhDeltaTotal: { $sum: { $ifNull: ["$energyKwhDelta", 0] } },
          firstTimestamp: { $min: "$timestamp" },
          lastTimestamp: { $max: "$timestamp" },
        },
      },
    ])
    .toArray();

  const samples = await collection
    .find(match, {
      projection: {
        _id: 0,
        timestamp: 1,
        eventType: 1,
        powerKw: 1,
        voltageV: 1,
        currentA: 1,
        energyKwh: 1,
        energyKwhDelta: 1,
      },
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .toArray();

  samples.reverse();

  return {
    from,
    to,
    sampleCount: stats?.sampleCount ?? 0,
    powerKw: {
      min: stats?.powerMin ?? null,
      max: stats?.powerMax ?? null,
      avg: stats?.powerAvg ?? null,
    },
    voltageV: {
      min: stats?.voltageMin ?? null,
      max: stats?.voltageMax ?? null,
      avg: stats?.voltageAvg ?? null,
    },
    currentA: {
      min: stats?.currentMin ?? null,
      max: stats?.currentMax ?? null,
      avg: stats?.currentAvg ?? null,
    },
    energyKwhDeltaTotal: stats?.energyKwhDeltaTotal ?? 0,
    firstTimestamp: stats?.firstTimestamp ?? null,
    lastTimestamp: stats?.lastTimestamp ?? null,
    samples: samples as TelemetrySample[],
  };
}
