import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import type { Db } from "mongodb";

const CHECKPOINT_TTL_SECONDS = 7 * 24 * 60 * 60;

// The saver bundles its own mongodb driver major, so the backend's client is
// structurally identical but nominally a different type.
type SaverClient = ConstructorParameters<typeof MongoDBSaver>[0]["client"];

let checkpointer: Promise<MongoDBSaver> | null = null;

export function getCheckpointer(db: Db): Promise<MongoDBSaver> {
  checkpointer ??= (async () => {
    const saver = new MongoDBSaver({
      client: db.client as unknown as SaverClient,
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
