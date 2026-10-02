import type { Db } from "mongodb";
import { ObjectId } from "mongodb";

import { insertUserReportedIncident, type IncidentSeverityDoc } from "../../db/repositories/incidents";
import { findChargingSessionById } from "../../db/repositories/chargingSessions";

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

export async function startIncidentReview(db: Db, incident: ReportSessionIncidentInput) {
  if (!isValidObjectId(incident.sessionId)) {
    throw new IncidentSessionNotFoundError();
  }



  const session = await findChargingSessionById(db, incident.sessionId);
  if (!session) {
    throw new IncidentSessionNotFoundError();
  }

  const description = normalizeIncidentDescription(incident.description);
  if (!description) {
    throw new InvalidIncidentDescriptionError();
  }

  const severity = incident.severity;

  // We invoke the agent and tell it to review the appropiate information

  // Additional logic to start an incident review can be added here.
}

export async function reportSessionIncident(db: Db, input: ReportSessionIncidentInput) {
  if (!isValidObjectId(input.sessionId)) {
    throw new IncidentSessionNotFoundError();
  }

  // To start an incident review. 



  const description = normalizeIncidentDescription(input.description);
  if (!description) {
    throw new InvalidIncidentDescriptionError();
  }

  const session = await findChargingSessionById(db, input.sessionId);
  if (!session) {
    throw new IncidentSessionNotFoundError();
  }

  return insertUserReportedIncident(db, {
    stationId: session.stationId,
    chargingPointId: session.chargingPointId,
    sessionId: session._id,
    severity: input.severity,
    description
  });
}

export function createReportSessionIncidentResponse(
  doc: Awaited<ReturnType<typeof reportSessionIncident>>
) {
  return {
    incidentId: String(doc._id)
  };
}
