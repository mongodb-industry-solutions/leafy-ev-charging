"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOperatorTools = createOperatorTools;
const tools_1 = require("@langchain/core/tools");
const tools_2 = require("./tools");
const stationIdentifierSchema = {
    type: "string",
    minLength: 1,
    maxLength: 120,
    description: "Station ObjectId, exact name/operator/station code, or address (comma-separated parts).",
};
function createOperatorTools(db) {
    return [
        (0, tools_1.tool)(async () => JSON.stringify(await (0, tools_2.summarizeIncidents)(db)), {
            name: "summarizeIncidents",
            description: "Summarize incidents across the entire charging network.",
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {}
            }
        }),
        (0, tools_1.tool)(async ({ stationId }) => JSON.stringify(await (0, tools_2.summarizeStationIncidents)(db, stationId)), {
            name: "summarizeStationIncidents",
            description: "Summarize incidents for a specific charging station. Use a station ID from the conversation or trusted application data.",
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
        }),
        (0, tools_1.tool)(async ({ stationId }) => JSON.stringify(await (0, tools_2.getSelectedChargerDetails)(db, stationId)), {
            name: "getSelectedChargerDetails",
            description: "Get a station's connectors, pricing, availability and amenities by station ID, exact name/operator, or address. " +
                "Returns the matching stations, or null if none.",
            schema: {
                type: "object",
                properties: { stationId: stationIdentifierSchema },
                required: ["stationId"],
                additionalProperties: false,
            },
        }),
        (0, tools_1.tool)(async (input) => JSON.stringify(await (0, tools_2.skimTelemetry)(db, input)), {
            name: "skimTelemetry",
            description: "Summarize charging telemetry for a session, charging point, or station over a time window. " +
                "Returns aggregate power/voltage/current stats, delivered energy, and the most recent samples. " +
                "Provide at least one of sessionId, chargingPointId, or stationId, plus from and to.",
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    sessionId: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        description: "MongoDB ObjectId of the charging session."
                    },
                    chargingPointId: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        description: "MongoDB ObjectId of the charging point."
                    },
                    stationId: {
                        type: "string",
                        pattern: "^[a-fA-F0-9]{24}$",
                        description: "MongoDB ObjectId of the charging station."
                    },
                    from: {
                        type: "string",
                        format: "date-time",
                        description: "Inclusive start of the window, with timezone."
                    },
                    to: {
                        type: "string",
                        format: "date-time",
                        description: "Exclusive end of the window, with timezone."
                    },
                    limit: {
                        type: "integer",
                        minimum: 1,
                        maximum: 500,
                        default: 100,
                        description: "Maximum number of recent samples to return."
                    }
                },
                required: ["from", "to"]
            }
        }),
        (0, tools_1.tool)(async (input) => JSON.stringify(await (0, tools_2.searchManuals)(db, input)), {
            name: "searchManuals",
            description: "Search the equipment manual for sections relevant to a symptom or error code. " +
                "Returns matching sections with their heading path and codes. Use it to ground root cause and repair steps.",
            schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                    query: { type: "string", minLength: 1, maxLength: 500 },
                    codes: {
                        type: "array",
                        items: { type: "string" },
                        maxItems: 10,
                        description: "Error/warning/notice codes to match exactly, e.g. E-05."
                    },
                    limit: { type: "integer", minimum: 1, maximum: 20, default: 5 }
                },
                required: ["query"]
            }
        }),
        (0, tools_1.tool)(async (input) => JSON.stringify(await (0, tools_2.rankChargingActivity)(db, input)), {
            name: "rankChargingActivity",
            description: "Rank stations or charging points over a date range by recorded session revenue, delivered energy, or started session count. Revenue rankings are separated by currency and are not operating profit.",
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
        })
    ];
}
