import type { IncomingMessage } from "node:http";
import type { Server } from "node:http";
import { URL } from "node:url";
import { WebSocket, WebSocketServer } from "ws";

import { OcppConnectionManager } from "./connectionManager";
import { applyTransactionEvent } from "../db/repositories/chargingSessions";
import { Db } from "mongodb";
import { markChargingPointAvailable } from "../db/repositories/chargingStations";

type OcppCall = [
  messageType: 2,
  messageId: string,
  action: string,
  payload: Record<string, unknown>
];

type ParsedTransactionEvent = {
  transactionId: string;
  eventType: "Started" | "Updated" | "Ended";
  timestamp: Date;
  meterRegisterKwh: number;
};

export function attachOcppServer(
  db: Db,
  httpServer: Server,
  connections: OcppConnectionManager
): void {
  const webSocketServer = new WebSocketServer({ noServer: true });

  httpServer.on("upgrade", (request, socket, head) => {
    const requestUrl = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? "localhost"}`
    );

    const match = requestUrl.pathname.match(/^\/ocpp\/([^/]+)$/);

    if (!match) {
      socket.destroy();
      return;
    }

    const chargePointId = decodeURIComponent(match[1]);

    webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
      webSocketServer.emit(
        "connection",
        webSocket,
        request,
        chargePointId
      );
    });
  });

  webSocketServer.on(
    "connection",
    (
      socket: WebSocket,
      _request: IncomingMessage,
      chargePointId: string
    ) => {
      connections.register(chargePointId, socket);

      socket.on("message", (rawMessage) => {
        void handleOcppMessage(
          socket,
          chargePointId,
          rawMessage.toString(),
          connections,
          db
        );
      });

      socket.on("error", (error) => {
        console.error(
          `OCPP connection error for ${chargePointId}`,
          error
        );
      });

      socket.on("close", () => {
        connections.remove(chargePointId, socket);
        console.log(`OCPP disconnected: ${chargePointId}`);
      });

      console.log(`OCPP connected: ${chargePointId}`);
    }
  );
}

async function handleOcppMessage(
  socket: WebSocket,
  chargePointId: string,
  rawMessage: string,
  connections: OcppConnectionManager,
  db: Db,
): Promise<void> {
  let message: unknown;

  try {
    message = JSON.parse(rawMessage);
  } catch {
    socket.close(1007, "Invalid JSON");
    return;
  }

  if (!Array.isArray(message) || message[0] !== 2) {
    console.warn(`Unsupported OCPP frame from ${chargePointId}`, message);
    return;
  }

  const [
    ,
    messageId,
    action,
    payload
  ] = message as OcppCall;

  if (action === "BootNotification") {
    const response = [
      3,
      messageId,
      {
        currentTime: new Date().toISOString(),
        interval: 30,
        status: "Accepted"
      }
    ];

    socket.send(JSON.stringify(response));

    console.log(`Boot accepted: ${chargePointId}`);

    return;
  }

  if (action === "StatusNotification") {
    console.log(
      `Status from ${chargePointId}:`,
      payload
    );

    return;
  }

  if (action === "TransactionEvent") {
  let event: ParsedTransactionEvent;

  try {
    event = parseTransactionEvent(payload);
  } catch (error) {
    socket.send(
      JSON.stringify([
        4,
        messageId,
        "FormationViolation",
        error instanceof Error ? error.message : "Invalid TransactionEvent",
        {}
      ])
    );
    return;
  }

  try {
    const updatedSession = await applyTransactionEvent(db, event);

    if (!updatedSession) {
      socket.send(
        JSON.stringify([
          4,
          messageId,
          "GenericError",
          `No active session found for transaction ${event.transactionId}`,
          {}
        ])
      );
      return;
    }

    if (event.eventType === "Ended") {
      const released = await markChargingPointAvailable(
        db,
        updatedSession.stationId,
        updatedSession.chargingPointId
      );

      if (!released) {
        console.warn(
          `Charging point was not released for session ${event.transactionId}; it may already be available`
        );
      }
    }

    socket.send(JSON.stringify([3, messageId, {}]));
  } catch (error) {
    console.error(
      `Failed to persist TransactionEvent for ${event.transactionId}`,
      error
    );

    socket.send(
      JSON.stringify([
        4,
        messageId,
        "InternalError",
        "Failed to persist TransactionEvent",
        {}
      ])
    );
  }

  return;
}

  if (action === "MeterValues") {
    console.log(
      `Meter values from ${chargePointId}:`,
      payload
    );

    return;
  }

  console.warn(
    `Unknown OCPP action from ${chargePointId}: ${action}`
  );

  connections.send(chargePointId, [
    4,
    messageId,
    "NotImplemented",
    `Action not implemented: ${action}`,
    {}
  ]);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}



function parseTransactionEvent(value: unknown): ParsedTransactionEvent {
  if (!isRecord(value)) {
    throw new Error("TransactionEvent payload must be an object");
  }

  const transactionInfo = value.transactionInfo;
  if (!isRecord(transactionInfo)) {
    throw new Error("TransactionEvent is missing transactionInfo");
  }

  const transactionId = transactionInfo.transactionId;
  if (typeof transactionId !== "string" || transactionId.trim() === "") {
    throw new Error("TransactionEvent has an invalid transactionId");
  }

  const eventType = value.eventType;
  if (
    eventType !== "Started" &&
    eventType !== "Updated" &&
    eventType !== "Ended"
  ) {
    throw new Error("TransactionEvent has an unsupported eventType");
  }

  const timestamp =
    typeof value.timestamp === "string" ? new Date(value.timestamp) : null;
  if (!timestamp || Number.isNaN(timestamp.getTime())) {
    throw new Error("TransactionEvent has an invalid timestamp");
  }

  if (!Array.isArray(value.meterValue)) {
    throw new Error("TransactionEvent is missing meterValue");
  }

  let meterRegisterKwh: number | undefined;

  for (const meterValue of value.meterValue) {
    if (!isRecord(meterValue) || !Array.isArray(meterValue.sampledValue)) {
      continue;
    }

    for (const sample of meterValue.sampledValue) {
      if (
        !isRecord(sample) ||
        sample.measurand !== "Energy.Active.Import.Register"
      ) {
        continue;
      }

      const rawValue = sample.value;
      if (
        (typeof rawValue !== "number" && typeof rawValue !== "string") ||
        (typeof rawValue === "string" && rawValue.trim() === "")
      ) {
        throw new Error("TransactionEvent has an invalid energy register value");
      }

      const registerWh = Number(rawValue);
      if (!Number.isFinite(registerWh) || registerWh < 0) {
        throw new Error("TransactionEvent has an invalid energy register value");
      }

      meterRegisterKwh = registerWh / 1000;
    }
  }

  if (meterRegisterKwh === undefined) {
    throw new Error("TransactionEvent is missing its energy register");
  }

  return { transactionId, eventType, timestamp, meterRegisterKwh };
}