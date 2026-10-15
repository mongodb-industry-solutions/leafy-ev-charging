"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckpointer = getCheckpointer;
const langgraph_checkpoint_mongodb_1 = require("@langchain/langgraph-checkpoint-mongodb");
const CHECKPOINT_TTL_SECONDS = 7 * 24 * 60 * 60;
let checkpointer = null;
function getCheckpointer(db) {
    checkpointer ??= (async () => {
        const saver = new langgraph_checkpoint_mongodb_1.MongoDBSaver({
            client: db.client,
            dbName: db.databaseName,
            checkpointCollectionName: "agent_checkpoints",
            checkpointWritesCollectionName: "agent_checkpoint_writes",
            ttl: CHECKPOINT_TTL_SECONDS
        });
        const errors = await saver.setup();
        if (errors.length) {
            console.warn("[Agent] Checkpoint index setup reported errors", errors);
        }
        return saver;
    })().catch((error) => {
        checkpointer = null;
        throw error;
    });
    return checkpointer;
}
