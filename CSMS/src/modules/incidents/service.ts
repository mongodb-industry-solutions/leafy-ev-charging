import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

import {
  findIncidentById,
  insertUserReportedIncident,
  saveIncidentReview,
  type IncidentReviewDoc,
  type IncidentSeverityDoc
} from "../../db/repositories/incidents";
import { findChargingSessionById } from "../../db/repositories/chargingSessions";
import { runIncidentReview } from "../../../agent/ops/review";

export class IncidentSessionNotFoundError extends Error {
  constructor() {
    super("Charging session not found");
    this.name = "IncidentSessionNotFound";
  }
}

export class InvalidIncidentDescriptionError extends Error {
  constructor() {
    super("Incident description cannot be empty");
    this.name = "InvalidIncidentDescription";
  }
}

export class InvalidIncidentStationError extends Error {
  constructor() {
    super("stationId must be a valid MongoDB ObjectId");
    this.name = "InvalidIncidentStation";
  }
}

type ReportSessionIncidentInput = {
  sessionId: string;
  severity: IncidentSeverityDoc;
  description: string;
};

function isValidObjectId(value: string): boolean {
  return ObjectId.isValid(value);
}

function normalizeIncidentDescription(description: string): string {
  return description.trim();
}

export type IncidentReviewInput = {
  stationId: string;
  description: string;
};

export async function startIncidentReview(db: Db, input: IncidentReviewInput) {
  if (!isValidObjectId(input.stationId)) {
    throw new InvalidIncidentStationError();
  }

  const description = normalizeIncidentDescription(input.description);
  if (!description) {
    throw new InvalidIncidentDescriptionError();
  }

  return runIncidentReview(db, {
    stationId: input.stationId,
    description
  });
}

export async function reviewIncident(db: Db, incidentId: string) {
  const incident = await findIncidentById(db, incidentId);
  if (!incident) {
    throw new Error(`Incident ${incidentId} not found`);
  }

  const review = await runIncidentReview(db, {
    stationId: incident.stationId.toHexString(),
    description: incident.description
  });

  const doc: IncidentReviewDoc = {
    reviewedAt: new Date(),
    summary: review.summary,
    likelyCause: review.likelyCause,
    solution: review.solution,
    disposition: review.disposition,
    scheduledFor: review.scheduledFor ?? null,
    nextStep: review.nextStep,
    confidence: review.confidence,
    severity: review.severity,
    manualReferences: review.manualReferences,
    pastIncidents: review.pastIncidents,
    estimatedRepairTime: review.estimatedRepairTime,
    reasoning: review.reasoning,
    toolsUsed: review.toolsUsed
  };

  await saveIncidentReview(db, incident._id, doc);
  return doc;
}

export async function reportSessionIncident(db: Db, input: ReportSessionIncidentInput) {
  if (!isValidObjectId(input.sessionId)) {
    throw new IncidentSessionNotFoundError();
  }

  const description = normalizeIncidentDescription(input.description);
  if (!description) {
    throw new InvalidIncidentDescriptionError();
  }

  const session = await findChargingSessionById(db, input.sessionId);
  if (!session) {
    throw new IncidentSessionNotFoundError();
  }

  const incident = await insertUserReportedIncident(db, {
    stationId: session.stationId,
    chargingPointId: session.chargingPointId,
    sessionId: session._id,
    severity: input.severity,
    description
  });

  // Generate the review in the background; do not block the mutation.
  void reviewIncident(db, incident._id.toHexString()).catch((error) => {
    console.error(
      `Incident review failed for ${incident._id.toHexString()}`,
      error
    );
  });

  return incident;
}

export function createReportSessionIncidentResponse(
  doc: Awaited<ReturnType<typeof reportSessionIncident>>
) {
  return {
    incidentId: String(doc._id)
  };
}
