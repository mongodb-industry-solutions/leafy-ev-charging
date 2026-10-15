# Not pure OCPP
El estandar OCPP pide que haya 1 conexion de websocket por cada estacion de carga, sin embargo esto es imposible, la arquitectura de esta demo es que dentro del requestTransaction se va a enviar un charging point ID, y en ese momento el simulador va a empezar a enviar informacion de telemetria con ese ID de charging point.

# TODO: stale after the simulator was decoupled (OCPP 2.1 over websocket)
- README.md: architecture mermaid, "Simulator" bullet and "Live telemetry using change streams" still describe the old change-stream simulator.
- docker-compose.yml: simulator still gets MONGODB_URI, MONGODB_DATABASE and CHANGE_STREAM_RETRY_SECONDS; .env.example still has CHANGE_STREAM_RETRY_SECONDS.
- frontend/src/lib/utils/const.ts: Behind the Scenes says the simulator "reacts to session changes and writes telemetry back into MongoDB".
- frontend/src/lib/utils/mongoSpotlights.ts: "session-changestream" spotlight; OCPP spotlight badge and caption say 2.0.1 but the simulator uses 2.1.
- Confirm the Claude Haiku claim in demo narration: .env.example only has a BEDROCK_MODEL_ID placeholder.
