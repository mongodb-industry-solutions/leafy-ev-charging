import type { IncomingMessage } from "node:http";
import type { Server } from "node:http";
import { URL } from "node:url";
import { WebSocket, WebSocketServer } from "ws";

import { OcppConnectionManager } from "./connectionManager";

type OcppCall = [
  messageType: 2,
  messageId: string,
  action: string,
  payload: Record<string, unknown>
];

export function attachOcppServer(
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
          connections
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
  connections: OcppConnectionManager
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
    console.log(
      `Transaction event from ${chargePointId}:`,
      payload
    );

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