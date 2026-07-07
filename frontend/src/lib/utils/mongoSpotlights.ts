/**
 * Content registry for the MongoDB "spotlight" callouts surfaced across the
 * demo (see `@/ui/MongoSpotlight`). Each entry pairs a short "why this matters"
 * note with the real MongoDB query, aggregation pipeline, or document shape
 * behind a piece of the UI. Snippets are copied verbatim from the backend and
 * simulator so what the audience sees is what runs.
 */

export type SpotlightLanguage = "javascript" | "json" | "python" | "graphql";

export interface SpotlightSnippet {
  /** Short label shown as the tab / section title for this snippet. */
  label: string;
  language: SpotlightLanguage;
  code: string;
  /** Optional one-line note rendered above the code block. */
  caption?: string;
  /**
   * When set, renders a friendly hint instead of a code block (used for empty
   * live-data states).
   */
  hint?: string;
  /**
   * Marks this snippet as the target for injected `liveJson` — the live data is
   * rendered inside this snippet's tab (below its code) instead of as a separate
   * leading "Live data" tab.
   */
  liveSlot?: boolean;
  /**
   * Runtime-only: the live data injected into a `liveSlot` snippet by
   * `MongoSpotlight`. Not set in the static registry.
   */
  live?: {
    label: string;
    code?: string;
    hint?: string;
  };
}

export interface MongoSpotlightEntry {
  /** Modal title. */
  title: string;
  /** Capability pill, e.g. "Geospatial", "Aggregation · $facet". */
  capability: string;
  /** One or two sentences on why MongoDB is a good fit here. */
  summary: string;
  snippets: SpotlightSnippet[];
  /** Optional "Learn more" link (MongoDB docs / customer story). */
  docsUrl?: string;
  docsLabel?: string;
}

export const MONGO_SPOTLIGHTS = {
  "map-geo": {
    title: "Finding stations on the map",
    capability: "Geospatial · Aggregation",
    summary:
      "Stations are stored as GeoJSON points and indexed with a 2dsphere index, so MongoDB answers \"what's in this map viewport?\" natively. At low zoom the same collection is clustered server-side with a single aggregation, so drivers get a fast, trusted answer before committing to a charger.",
    snippets: [
      {
        label: "$geoWithin query",
        language: "javascript",
        caption:
          "The map viewport becomes a GeoJSON polygon; $geoWithin returns only the stations inside it.",
        code: `const boxPolygon = {
  type: "Polygon",
  coordinates: [
    [
      [minLng, minLat],
      [maxLng, minLat],
      [maxLng, maxLat],
      [minLng, maxLat],
      [minLng, minLat]
    ]
  ]
};

const match = {
  location: {
    $geoWithin: { $geometry: boxPolygon }
  }
};

// plus optional filters merged into the same match:
//   connectors:   { $elemMatch: { type: { $in: [...] } } }
//   power:        { $gte: minPowerKw }
//   price:        { $lte: maxPriceCents }
db.chargingStations.find(match);`
      },
      {
        label: "2dsphere index",
        language: "javascript",
        caption: "Created on startup so geospatial queries stay fast at scale.",
        code: `await db.collection("chargingStations").createIndex(
  { location: "2dsphere" },
  { name: "location_2dsphere" }
);`
      },
      {
        label: "Server-side clustering",
        language: "javascript",
        caption:
          "Zoomed out, one aggregation buckets stations into a grid and averages their coordinates — no need to ship thousands of pins to the browser.",
        code: `db.chargingStations.aggregate([
  { $match: match },
  {
    $group: {
      _id: {
        gridX: {
          $floor: {
            $divide: [
              { $add: [{ $arrayElemAt: ["$location.coordinates", 0] }, 180] },
              step
            ]
          }
        },
        gridY: {
          $floor: {
            $divide: [
              { $add: [{ $arrayElemAt: ["$location.coordinates", 1] }, 90] },
              step
            ]
          }
        }
      },
      count: { $sum: 1 },
      avgLat: { $avg: { $arrayElemAt: ["$location.coordinates", 1] } },
      avgLng: { $avg: { $arrayElemAt: ["$location.coordinates", 0] } }
    }
  },
  {
    $project: {
      _id: 0,
      count: 1,
      location: { lat: "$avgLat", lng: "$avgLng" }
    }
  }
]);`
      }
    ],
    docsUrl: "https://www.mongodb.com/docs/manual/geospatial-queries/",
    docsLabel: "MongoDB geospatial queries"
  },

  "map-facets": {
    title: "Building the filter controls",
    capability: "Aggregation · $facet",
    summary:
      "The connector types, power range, price range, and \"available now\" count that drive the filters are all computed in a single pass over the stations with $facet — one round trip to the database instead of four separate queries.",
    snippets: [
      {
        label: "$facet aggregation",
        language: "javascript",
        caption:
          "Each sub-pipeline runs against the same input set, returning every facet the filter UI needs at once.",
        code: `db.chargingStations.aggregate([
  {
    $facet: {
      connectorTypes: [
        { $unwind: "$chargingPoints" },
        { $unwind: "$chargingPoints.connectors" },
        {
          $group: {
            _id: "$chargingPoints.connectors.type",
            stationIds: { $addToSet: "$_id" }
          }
        },
        { $project: { type: "$_id", count: { $size: "$stationIds" } } },
        { $sort: { count: -1 } }
      ],
      powerRange: [
        { $unwind: "$chargingPoints" },
        { $unwind: "$chargingPoints.connectors" },
        {
          $group: {
            _id: null,
            min: { $min: "$chargingPoints.connectors.power" },
            max: { $max: "$chargingPoints.connectors.power" }
          }
        }
      ],
      priceRange: [
        { $match: { "pricing.defaultTariff.priceCentsPerKwh": { $exists: true, $ne: null } } },
        {
          $group: {
            _id: null,
            min: { $min: "$pricing.defaultTariff.priceCentsPerKwh" },
            max: { $max: "$pricing.defaultTariff.priceCentsPerKwh" }
          }
        }
      ],
      availableNowCount: [
        { $match: { "availability.availableNowPoints": { $gt: 0 } } },
        { $count: "count" }
      ]
    }
  }
]);`
      }
    ],
    docsUrl:
      "https://www.mongodb.com/docs/manual/reference/operator/aggregation/facet/",
    docsLabel: "$facet aggregation stage"
  },

  "map-reserve": {
    title: "Reserving a charging point",
    capability: "Atomic document update",
    summary:
      "Reserving a bay isn't just reading catalog data — it changes operational state. A single updateOne with arrayFilters flips the exact embedded charging point and decrements the station's available count atomically, so two drivers can't claim the same bay.",
    snippets: [
      {
        label: "updateOne + arrayFilters",
        language: "javascript",
        caption:
          "The filter also guards on `availableNow: true`, so the write only succeeds if the bay is still free.",
        code: `db.chargingStations.updateOne(
  {
    _id: stationId,
    "chargingPoints.chargingPointId": chargingPointId,
    "chargingPoints.availableNow": true
  },
  {
    $set: { "chargingPoints.$[elem].availableNow": false },
    $inc: { "availability.availableNowPoints": -1 }
  },
  {
    arrayFilters: [
      { "elem.chargingPointId": chargingPointId, "elem.availableNow": true }
    ]
  }
);`
      }
    ],
    docsUrl:
      "https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/",
    docsLabel: "Filtered positional operator"
  },

  "session-document": {
    title: "The charging session document",
    capability: "Document model · Extended reference",
    summary:
      "A session is one rich document that embeds snapshots of the station, vehicle, and pricing as they were at booking time. That means the whole booking → charging → billing → feedback lifecycle reads back in a single query, with no joins and no risk of history changing when the catalog does.",
    snippets: [
      {
        label: "Document shape",
        language: "javascript",
        caption:
          "The TypeScript model that mirrors the stored BSON — snapshots are embedded, live entities are referenced by _id.",
        code: `type ChargingSessionDoc = {
  _id: ObjectId;
  userId: ObjectId;          // reference
  vehicleId: ObjectId;       // reference
  stationId: ObjectId;       // reference
  chargingPointId: ObjectId; // reference
  stationSnapshot: StationSnapshotDoc;   // embedded at booking time
  vehicleSnapshot: VehicleSnapshotDoc;   // embedded at booking time
  status: "BOOKED" | "ACTIVE" | "COMPLETED" | "CANCELED" | "NO_SHOW" | "FAILED";
  booking: BookingDoc;
  charging: ChargingDoc;
  feedback?: FeedbackDoc | null;
  pricingSnapshot: PricingDoc;           // embedded at booking time
  cost: CostDoc;
  createdAt: Date;
  updatedAt: Date;
};`
      },
      {
        label: "Example document",
        language: "json",
        caption: "A completed session, as it lives in the collection.",
        code: `{
  "_id": { "$oid": "65c8f2e2d2f4c3a9b3b9d003" },
  "userId": { "$oid": "65c8f2e2d2f4c3a9b3b9a111" },
  "vehicleId": { "$oid": "65c8f2e2d2f4c3a9b3b9a221" },
  "stationId": { "$oid": "65c8f2e2d2f4c3a9b3b9b001" },
  "chargingPointId": { "$oid": "65c8f2e2d2f4c3a9b3b9b102" },
  "stationSnapshot": {
    "name": "Downtown Mall Charging",
    "location": { "type": "Point", "coordinates": [8.5417, 47.3769] },
    "addressShort": "Main St 10, Zurich",
    "chargingPointLabel": "Bay 2"
  },
  "vehicleSnapshot": { "vinLast6": "000001", "make": "Volkswagen", "model": "ID.4" },
  "status": "COMPLETED",
  "charging": {
    "startedAt": { "$date": "2026-02-10T17:32:04Z" },
    "endedAt": { "$date": "2026-02-10T18:48:31Z" },
    "connectorUsed": { "type": "TYPE2", "power": 22.0, "tethered": false },
    "energyDeliveredKwh": 19.72,
    "socStartPercent": 20.0,
    "socStopPercent": 80.0
  },
  "pricingSnapshot": { "currency": "EUR", "priceCentsPerKwh": 55 },
  "cost": { "totalCents": 1085, "energyCents": 1085, "idleCents": 0 },
  "feedback": { "rating": 5, "comment": "Easy start and the bay was clean." }
}`
      }
    ],
    docsUrl:
      "https://www.mongodb.com/docs/manual/data-modeling/design-patterns/data-representation/extended-reference/",
    docsLabel: "Extended reference pattern"
  },

  "session-changestream": {
    title: "Live telemetry while charging",
    capability: "Change Streams · Time Series",
    summary:
      "When a session turns ACTIVE, the simulator picks it up through a MongoDB change stream — no polling, no message broker. It then streams high-frequency samples into a time-series collection that powers live status and, later, operator analytics.",
    snippets: [
      {
        label: "Change stream",
        language: "python",
        caption:
          "The simulator watches chargingSessions and reacts to status changes with the full updated document.",
        code: `pipeline = [
    {
        "$match": {
            "$or": [
                {"operationType": "insert",
                 "fullDocument.status": {"$in": ["ACTIVE", "BOOKED"]}},
                {"operationType": "update",
                 "updateDescription.updatedFields.status": {"$exists": True}},
                {"operationType": "replace"},
                {"operationType": "delete"},
            ]
        }
    }
]

with sessions.watch(
    pipeline=pipeline,
    full_document="updateLookup",
) as stream:
    for change in stream:
        await self._process_change(change)`
      },
      {
        label: "Telemetry insert",
        language: "python",
        caption:
          "Every few seconds an active session appends a SESSION_SAMPLE to the time-series collection.",
        code: `telemetry.insert_one({
    "timestamp": now,
    "meta": {
        "stationId": station_id,
        "chargingPointId": charging_point_id,
        "evseId": evse_id,
    },
    "messageType": "SESSION_SAMPLE",
    "sessionId": session_id,
    "powerKw": 118.4,
    "energyKwhDelta": 0.22,
    "voltageV": 800,
    "currentA": 148,
    "temperatureC": 38.7,
})`
      },
      {
        label: "Time-series collection",
        language: "javascript",
        caption:
          "telemetry is provisioned as a native time-series collection with automatic 14-day expiry.",
        code: `db.createCollection("telemetry", {
  timeseries: {
    timeField: "timestamp",
    metaField: "meta",
    granularity: "seconds"
  },
  expireAfterSeconds: 1209600 // 14 days
});`
      }
    ],
    docsUrl: "https://www.mongodb.com/docs/manual/changeStreams/",
    docsLabel: "MongoDB Change Streams"
  },

  "dashboard-analytics": {
    title: "Real-time analytics on live operational data",
    capability: "Real-time analytics · Workload isolation",
    summary:
      "Every chart on this page is a MongoDB aggregation pipeline running on the very same data that serves drivers — no ETL and no separate data warehouse to keep in sync. On Atlas you can send these analytical reads to dedicated analytics nodes, so operator dashboards and reporting run in real time without ever slowing down the live reservations, session writes, and telemetry ingestion on the operational side.",
    snippets: [
      {
        label: "Workload isolation",
        language: "javascript",
        caption:
          "Point heavy dashboard reads at dedicated Atlas analytics nodes — same data, isolated compute, zero impact on live transactions.",
        code: `// Analytics reads target dedicated Atlas analytics nodes,
// isolated from the operational workload (reservations,
// session writes, telemetry ingestion).
db.chargingSessions.aggregate(pipeline, {
  readPreference: {
    mode: "secondary",
    tags: [{ nodeType: "ANALYTICS" }]
  }
});`
      },
      {
        label: "Telemetry · time series",
        language: "javascript",
        liveSlot: true,
        caption:
          "Powers the Telemetry load chart. High-frequency samples live in a time-series collection and are rolled up into hourly buckets on the fly.",
        code: `db.telemetry.aggregate([
  { $match: { timestamp: { $gte: recentCutoff } } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" } },
      sampleCount: { $sum: 1 },
      avgPowerKw: { $avg: "$powerKw" },
      maxPowerKw: { $max: "$powerKw" },
      energyDeltaKwh: { $sum: { $ifNull: ["$energyKwhDelta", 0] } }
    }
  },
  { $sort: { _id: 1 } }
]);`
      },
      {
        label: "Sessions · $facet",
        language: "javascript",
        caption:
          "Powers the throughput and status charts. One $facet pass returns the status mix, a 7-day summary, and a daily trend together.",
        code: `db.chargingSessions.aggregate([
  { $set: { activityAt: { $ifNull: ["$charging.endedAt", "$updatedAt"] } } },
  {
    $facet: {
      sessionStatusBreakdown: [
        { $group: { _id: "$status", value: { $sum: 1 } } }
      ],
      summary: [
        {
          $group: {
            _id: null,
            activeSessions: {
              $sum: { $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0] }
            },
            revenueLast7DaysCents: {
              $sum: {
                $cond: [
                  { $gte: ["$activityAt", recentCutoff] },
                  { $ifNull: ["$cost.totalCents", 0] },
                  0
                ]
              }
            }
          }
        }
      ],
      recentSessionTrend: [
        { $match: { activityAt: { $gte: recentCutoff } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$activityAt" } },
            sessions: { $sum: 1 },
            completedSessions: {
              $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]
    }
  }
]);`
      }
    ],
    docsUrl:
      "https://www.mongodb.com/solutions/use-cases/analytics/real-time-analytics",
    docsLabel: "Real-time analytics on MongoDB"
  },

  overview: {
    title: "One operational data layer",
    capability: "MongoDB Atlas",
    summary:
      "The same LeafyCharge database powers everything you see: geospatial discovery on the map, atomic reservations, change-stream-driven telemetry, and the analytics on the operator dashboard. Look for the curly-brace icons throughout the app to see the exact MongoDB query behind each feature.",
    snippets: [
      {
        label: "Collections",
        language: "javascript",
        caption:
          "A single document database holds the whole EV charging domain — no separate stores to stitch together.",
        code: `// One database, purpose-built collections:
db.chargingStations   // GeoJSON + 2dsphere index  -> map & discovery
db.chargingPoints     // live EVSE state           -> availability
db.chargingSessions   // rich lifecycle documents  -> bookings & billing
db.telemetry          // time-series (14d TTL)      -> live power & analytics
db.incidents          // faults & user reports      -> operations
db.vehicles           // driver EV specs
db.users              // drivers & operators`
      }
    ],
    docsUrl:
      "https://www.mongodb.com/solutions/customer-case-studies/enbw",
    docsLabel: "EnBW customer story"
  }
} satisfies Record<string, MongoSpotlightEntry>;

export type MongoSpotlightId = keyof typeof MONGO_SPOTLIGHTS;
