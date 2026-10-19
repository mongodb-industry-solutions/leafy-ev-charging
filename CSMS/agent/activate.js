"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateAgent = activateAgent;
const graph_1 = require("./consumer/graph");
const graph_2 = require("./ops/graph");
async function activateAgent({ audience, turn, context }) {
    switch (audience) {
        case "DRIVER":
            return (0, graph_1.runConsumer)(turn, context);
        case "OPERATOR":
            return (0, graph_2.runOperator)(turn, context.authenticatedUserId, context.db);
        default:
            throw new Error("Unsupported agent audience");
    }
}
