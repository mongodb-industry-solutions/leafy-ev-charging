export const TALK_TRACK = [
  {
    heading: "Solution Overview",
    content: [
      {
        heading: "EV charging is now an operational reliability business",
        body: [
          "The EV charging market is moving from early deployment to large-scale operations. Public charging, depot charging, fast charging, fleet charging, roaming, pricing, payments, grid constraints, and service reliability now need to work together in near real time.",
          "For drivers and fleets, charging must be easy to find, compatible, transparently priced, and dependable. For operators, every charging point is a connected asset producing state, telemetry, errors, sessions, revenue, and customer-impacting incidents.",
        ],
      },
      {
        heading: "Every participant feels the data fragmentation",
        body: [
          "OEMs need charging experiences that extend the vehicle relationship instead of handing customers to unreliable third-party journeys. Charge point operators need uptime, remote diagnostics, predictive maintenance, and a consistent view across mixed hardware fleets.",
          "Energy providers and utilities need load visibility, forecasting, smart charging, and grid-aware planning. Mobility providers and startups need to iterate quickly across station discovery, reservations, subscriptions, roaming, billing, and user support.",
        ],
      },
      {
        heading: "Scale exposes architectures assembled too quickly",
        body: [
          "Many charging platforms grew by stitching together separate systems for charger state, telemetry, logs, search, transactions, analytics, and reporting. As networks grow, that fragmented approach becomes expensive to operate and harder to change safely.",
          "The core challenge is convergence: heterogeneous assets, high-frequency telemetry, fault logs, geospatial discovery, session transactions, pricing, partner integrations, and analytics all need to connect without slowing product teams down.",
        ],
      },
    ],
  },
  {
    heading: "Why MongoDB?",
    content: [
      {
        heading: "A unified operational data layer",
        body: [
          "MongoDB provides a data platform with the building blocks EV charging teams need to bring operational data, metadata, time-series telemetry, search indexes, vectors, and real-time analytics into one place.",
          "By keeping these capabilities close to the application data, teams can simplify the architecture, reduce ETL and synchronization work, and build customer and operator experiences on a consistent operational foundation.",
        ],
      },
      {
        heading: "MongoDB flexible document model",
        body: "Charging data is heterogeneous and changes quickly: stations, EVSEs, connectors, tariffs, reservations, users, charger firmware, diagnostic events, measurements, alarms, roaming metadata, and grid-facing context. MongoDB lets teams model that variety around application access patterns while still applying validation, TTL retention, sharding, and governance where the business depends on it.",
      },
      {
        heading: "Trusted by industry leaders",
        body: "MongoDB is used across mobility, energy, and EV charging scenarios by organizations ranging from OEMs to energy providers, software platforms, and energy startups. Public examples such as the [EnBW customer story](https://www.mongodb.com/solutions/customer-case-studies/enbw) show MongoDB supporting charging infrastructure management, geolocation search, flexibility, availability, and operational scale.",
      },
      {
        heading: "Scale growth while lowering TCO",
        body: "MongoDB helps teams grow from more stations, more regions, and more connected devices without multiplying the number of data platforms they operate. Fully managed Atlas, workload isolation, high availability, Online Archive, integrations with event and observability platforms, and stream processing help reduce operational burden while extending functionality.",
      },
      {
        heading: "Future-proof AI-ready solutions",
        body: "Future EV charging workflows will depend on agents that reason over charger state, telemetry, logs, incidents, documentation, customer history, and recommended actions. MongoDB is well positioned for agentic workloads because the same platform can hold operational facts, Atlas Search indexes, Vector Search embeddings, audit trails, and agent state or memory in one governed context.",
      },
    ],
  },
  {
    heading: "How to Demo",
    content: [
      {
        heading: "Open with the business problem",
        body: "Set the context before clicking: charging networks are scaling quickly, but reliability, interoperability, and operational visibility remain hard. The demo shows how MongoDB can support the operational data layer behind better charging experiences.",
      },
      {
        heading: "Demo steps",
        ordered: true,
        body: [
          "Start on Home. Explain that the app has two perspectives on the same charging network: the driver experience and the operator view.",
          "Open Station Finder. Search or pan the map, then use filters such as connector type, power, price, fast charging, and availability. Talk track: drivers need trusted, real-time answers before they commit to a charger.",
          "Open a station and reserve a charging point. Talk track: the app is not just reading catalog data; it is changing operational state and keeping availability consistent for the next user.",
          "Go to Session Activity. Start and complete the session. Talk track: sessions connect customer experience, billing context, energy delivered, vehicle information, and operational history.",
          "Report an incident from the session. Talk track: user feedback and fault reports become part of the same operational picture operators use to improve uptime and service quality.",
          "Switch to Admin View and open the Analytics Dashboard. Show availability, utilization, telemetry load, revenue, recent sessions, and incidents. Talk track: the same data that powers the driver journey also supports operations, reporting, and decision-making.",
          "Finish with Behind the Scenes. Expand the architecture image and explain that MongoDB can sit at the center of operational data, metadata, telemetry, search, geospatial discovery, real-time analytics, and future AI workloads.",
        ],
      },
      {
        heading: "Close with the takeaway",
        body: "Do not position LeafyCharge as the full product. Position it as a compact example of a repeatable architecture: one data platform supporting customer apps, operator dashboards, partner integrations, telemetry-driven maintenance, search, analytics, and AI-ready workflows.",
      },
    ],
  },
  {
    heading: "Behind the Scenes",
    content: [
      {
        image: {
          src: "/architecture.svg",
          alt: "LeafyCharge architecture",
          priority: true,
        },
      },
      {
        heading: "MongoDB connects live operations, telemetry, and experience",
        body: [
          "The Next.js frontend serves the driver and operator experiences through a Node.js GraphQL backend. The user interface is deliberately simple, but it represents real workloads: discovery, reservation, session management, incident reporting, and operations monitoring.",
          "MongoDB stores the operational core: users, vehicles, charging stations, charging points, sessions, incidents, and telemetry. Geospatial queries, document access patterns, validation, and aggregation pipelines power the main flows.",
          "The simulator reacts to session changes and writes telemetry back into MongoDB. That makes charger behavior visible to the operator view and creates the basis for diagnostics, proactive alerts, and predictive maintenance patterns.",
          "The same architecture can be extended with Atlas Search, Vector Search, Stream Processing, Online Archive, workload isolation, and AI agent state or memory depending on the customer’s maturity and operating model.",
        ],
      },
    ],
  },
];