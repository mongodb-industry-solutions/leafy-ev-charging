import { tool } from "@langchain/core/tools";
import type { Db } from "mongodb";
import {
  findStationsInArea,
  findChargingStation,
  getSelectedChargerDetails,
  getMyChargingHistory,
  type StationSearchCriteria,
} from "./tools";

const idSchema = { type: "string", pattern: "^[a-fA-F0-9]{24}$" } as const;
type HistoryInput = {
  mode: "current" | "recent" | "spending";
  from: string;
  to: string;
};

export function createConsumerTools(db: Db, authenticatedUserId: string) {
  return [
    tool(
      async (area: Parameters<typeof findStationsInArea>[1]) =>
        JSON.stringify(await findStationsInArea(db, area)),
      {
        name: "findStationsInArea",
        description:
          "Find nearby station IDs. Pass these IDs to findChargingStation.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            longitude: { type: "number", minimum: -180, maximum: 180 },
            latitude: { type: "number", minimum: -90, maximum: 90 },
            radiusMeters: {
              type: "number",
              exclusiveMinimum: 0,
              maximum: 100000,
            },
          },
          required: ["longitude", "latitude", "radiusMeters"],
        },
      },
    ),
    tool(
      async (criteria: StationSearchCriteria) =>
        JSON.stringify(await findChargingStation(db, criteria)),
      {
        name: "findChargingStation",
        description:
          "Filter and rank station IDs. Currency is required for price sorting/filtering.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            stationIds: {
              type: "array",
              items: idSchema,
              maxItems: 1000,
              description:
                "Omit for a network-wide search. Provide IDs to restrict candidates. " +
                "An empty array means no candidates.",
            },
            sortBy: {
              type: "string",
              enum: [
                "price",
                "power",
                "availability",
                "name",
                "open24h",
                "freshness",
              ],
            },
            availableOnly: { type: "boolean", default: false },
            minPowerKw: { type: "number", minimum: 0, default: 0 },
            maxPriceCentsPerKwh: {
              type: "integer",
              minimum: 0,
              maximum: Number.MAX_SAFE_INTEGER,
            },
            currency: {
              type: "string",
              pattern: "^[A-Z]{3}$",
              description: "Currency code, e.g. EUR",
            },
            limit: { type: "integer", minimum: 1, maximum: 10, default: 3 },
          },
          required: ["stationIds", "sortBy"],
        },
      },
    ),
    tool(
      async ({ stationId }: { stationId: string }) =>
        JSON.stringify(await getSelectedChargerDetails(db, stationId)),
      {
        name: "getSelectedChargerDetails",
        description:
          "Get a station's connectors, pricing, availability and amenities; null if absent.",
        schema: {
          type: "object",
          properties: { stationId: idSchema },
          required: ["stationId"],
          additionalProperties: false,
        },
      },
    ),
    tool(
      async ({ mode, from, to }: HistoryInput) => {
        if (typeof from !== "string" || typeof to !== "string")
          throw new Error("Dates must be strings");
        return JSON.stringify(
          await getMyChargingHistory(db, authenticatedUserId, {
            mode,
            from: new Date(from),
            to: new Date(to),
          }),
        );
      },
      {
        name: "getMyChargingHistory",
        description:
          "User's current ACTIVE/BOOKED sessions, recent ended sessions (up to 10), or COMPLETED spending by currency. Require from < to; current ignores the date filter.",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            mode: { type: "string", enum: ["current", "recent", "spending"] },
            from: {
              type: "string",
              format: "date-time",
              description: "Inclusive start, with timezone",
            },
            to: {
              type: "string",
              format: "date-time",
              description: "Exclusive end, with timezone",
            },
          },
          required: ["mode", "from", "to"],
        },
      },
    ),
  ];
}
