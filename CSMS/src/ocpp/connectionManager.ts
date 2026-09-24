import type { WebSocket } from "ws";

export class OcppConnectionManager {
  private readonly connections = new Map<string, WebSocket>();

  register(chargePointId: string, socket: WebSocket): void {
    const previous = this.connections.get(chargePointId);

    if (previous && previous !== socket) {
      previous.close(1000, "Replaced by a new connection");
    }

    this.connections.set(chargePointId, socket);

    socket.once("close", () => {
      if (this.connections.get(chargePointId) === socket) {
        this.connections.delete(chargePointId);
      }
    });
  }

  get(chargePointId: string): WebSocket | undefined {
    return this.connections.get(chargePointId);
  }

  remove(chargePointId: string, socket: WebSocket): void {
    if (this.connections.get(chargePointId) === socket) {
      this.connections.delete(chargePointId);
    }
  }

  send(
    chargePointId: string,
    message: unknown
  ): boolean {
    const socket = this.connections.get(chargePointId);

    if (!socket || socket.readyState !== socket.OPEN) {
      return false;
    }

    socket.send(JSON.stringify(message));
    return true;
  }
}

export const ocppConnections = new OcppConnectionManager();