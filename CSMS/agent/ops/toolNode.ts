import { tool } from "@langchain/core/tools";
import type { Db } from "mongodb";
import {
  getSelectedChargerDetails,
  rankChargingActivity,
  summarizeIncidents,
  summarizeStationIncidents,
  type ChargingActivityRankInput
} from "./tools";

export function createOperatorTools(db: Db) {
  return [
    tool(
      async () => JSON.stringify(await summarizeIncidents(db)),
      {
        name: "summarizeIncidents",
        description: "Summarize incidents across the entire charging network.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {}
        }
      }
    ),
    tool(
      async ({ stationId }: { stationId: string }) =>
        JSON.stringify(await summarizeStationIncidents(db, stationId)),
      {
        name: "summarizeStationIncidents",
        description:
          "Summarize incidents for a specific charging station. Use a station ID from the conversation or trusted application data.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            stationId: {
              type: "string",
              pattern: "^[a-fA-F0-9]{24}$",
              description: "MongoDB ObjectId of the charging station."
            }
          },
          required: ["stationId"]
        }
      }
    ),
    tool(
      async ({ stationId }: { stationId: string }) => {
        const station = await getSelectedChargerDetails(db, stationId);
        return JSON.stringify(station);
      },
      {
        name: "getSelectedChargerDetails",
        description:
          "Get a charging station's details, pricing, availability, connectors, and amenities by its MongoDB station ID.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            stationId: {
              type: "string",
              pattern: "^[a-fA-F0-9]{24}$",
              description: "MongoDB ObjectId of the charging station."
            }
          },
          required: ["stationId"]
        }
      }
    ),
    tool(
      async (input: ChargingActivityRankInput) =>
        JSON.stringify(await rankChargingActivity(db, input)),
      {
        name: "rankChargingActivity",
        description:
          "Rank stations or charging points over a date range by recorded session revenue, delivered energy, or started session count. Revenue rankings are separated by currency and are not operating profit.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            from: {
              type: "string",
              format: "date-time",
              description: "Inclusive start of the reporting period."
            },
            to: {
              type: "string",
              format: "date-time",
              description: "Exclusive end of the reporting period."
            },
            metric: {
              type: "string",
              enum: ["revenue", "energy", "sessions"]
            },
            groupBy: {
              type: "string",
              enum: ["station", "chargingPoint"]
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 10,
              default: 5
            }
          },
          required: ["from", "to", "metric", "groupBy"]
        }
      }
    )
  ];
}