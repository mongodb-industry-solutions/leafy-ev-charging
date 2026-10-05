import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

export type IncidentSeverityDoc = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IncidentTypeDoc =
  | "USER_REPORT"
  | "NO_HEARTBEAT"
  | "CONNECTOR_FAULT"
  | "POWER_DERATE"
  | "MAINTENANCE";

export type IncidentStatusDoc = "OPEN" | "ACKNOWLEDGED" | "RESOLVED";

export type IncidentReviewDisposition =
  | "AUTO_RESOLVED"
  | "MAINTENANCE_SCHEDULED";

export type IncidentReviewDoc = {
  reviewedAt: Date;
  summary: string;
  likelyCause: string;
  solution: string;
  disposition: IncidentReviewDisposition;
  scheduledFor: string | null;
  nextStep: string;
  confidence: string;
  severity: IncidentSeverityDoc;
  manualReferences: Array<{ section: string; codes: string[] }>;
  pastIncidents: string[];
  estimatedRepairTime: string;
  reasoning: string;
  toolsUsed: Array<{ tool: string; input: unknown; result: string | null }>;
};

export type IncidentDoc = {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  type: IncidentTypeDoc;
  severity: IncidentSeverityDoc;
  status: IncidentStatusDoc;
  stationId: ObjectId;
  chargingPointId?: ObjectId | null;
  sessionId?: ObjectId | null;
  detection: {
    source: "USER" | "SYSTEM";
    rule?: string | null;
  };
  description: string;
  resolution: {
    resolvedAt: Date | null;
    resolvedByUserId: ObjectId | null;
    notes: string | null;
    review: IncidentReviewDoc | null;
  };
};

type InsertIncidentInput = {
  stationId: ObjectId;
  chargingPointId?: ObjectId | null;
  sessionId?: ObjectId | null;
  severity: IncidentSeverityDoc;
  description: string;
};

export async function insertUserReportedIncident(
  database: Db,
  input: InsertIncidentInput
): Promise<IncidentDoc> {
  const nowDate = new Date();

  const doc: Omit<IncidentDoc, "_id"> = {
    createdAt: nowDate,
    updatedAt: nowDate,
    type: "USER_REPORT",
    severity: input.severity,
    status: "OPEN",
    stationId: input.stationId,
    chargingPointId: input.chargingPointId ?? null,
    sessionId: input.sessionId ?? null,
    detection: {
      source: "USER"
    },
    description: input.description,
    resolution: {
      resolvedAt: null,
      resolvedByUserId: null,
      notes: null,
      review: null
    }
  };

  const result = await database.collection<IncidentDoc>("incidents").insertOne(doc as IncidentDoc);

  return {
    _id: result.insertedId,
    ...doc
  };
}

export async function insertChargingStationIncident(
  database: Db,
  input: InsertIncidentInput
): Promise<IncidentDoc> {
  const nowDate = new Date();

  const doc: Omit<IncidentDoc, "_id"> = {
    createdAt: nowDate,
    updatedAt: nowDate,
    type: "CONNECTOR_FAULT",
    severity: input.severity,
    status: "OPEN",
    stationId: input.stationId,
    chargingPointId: input.chargingPointId ?? null,
    sessionId: input.sessionId ?? null,
    detection: {
      source: "SYSTEM"
    },
    description: input.description,
    resolution: {
      resolvedAt: null,
      resolvedByUserId: null,
      notes: null,
      review: null
    }
  };

  const result = await database.collection<IncidentDoc>("incidents").insertOne(doc as IncidentDoc);

  return {
    _id: result.insertedId,
    ...doc
  };
}

export async function findIncidentById(
  database: Db,
  incidentId: string | ObjectId
): Promise<IncidentDoc | null> {
  const _id =
    typeof incidentId === "string" ? new ObjectId(incidentId) : incidentId;

  return database.collection<IncidentDoc>("incidents").findOne({ _id });
}

export async function saveIncidentReview(
  database: Db,
  incidentId: ObjectId,
  review: IncidentReviewDoc
): Promise<boolean> {
  const result = await database
    .collection<IncidentDoc>("incidents")
    .updateOne(
      { _id: incidentId },
      { $set: { "resolution.review": review, updatedAt: new Date() } }
    );

  return result.matchedCount === 1;
}
