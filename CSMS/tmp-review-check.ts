import "dotenv/config";

import { connectMongo } from "./src/db/mongo";
import { reviewIncident } from "./src/modules/incidents/service";

async function main() {
  const db = await connectMongo();
  const incidentId = process.argv[2] ?? "6ac92815e4b59c2205815f95";
  console.log("Running review for", incidentId);
  const review = await reviewIncident(db, incidentId);
  console.log("SAVED", {
    disposition: review.disposition,
    scheduledFor: review.scheduledFor,
    solution: review.solution
  });
  process.exit(0);
}

main().catch((error) => {
  console.error("REVIEW FAILED:", error);
  process.exit(1);
});
