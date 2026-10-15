# Simulator (FastAPI)

FastAPI service that receives OCPP commands from the CSMS and emits simulated OCPP transaction events.

On startup, it:

- connects to the backend CSMS over OCPP 2.1 WebSockets
- starts a simulation after `RequestStartTransaction`
- emits `TransactionEvent` lifecycle and meter updates
- prevents duplicate simulations for the same session ID

## Prerequisites

- Docker and Docker Compose, or Python 3.12+ for local development

## Run With Docker Compose

From the repository root:

```bash
cp .env.example .env
docker compose --profile local up --build backend simulator
```

The simulator is exposed on `http://localhost:8000`.

Health check:

```bash
curl http://localhost:8000/health
```

To start the full application stack:

```bash
docker compose --profile local up --build
```

## Run Locally Without Docker

For direct local runs, place a `.env` file in `simulator/` or export the same variables in your shell.

```bash
cd simulator
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

## Environment Variables

Key variables used by the simulator:

- `SIMULATOR_URL` (default `http://localhost:8000`)
- `SESSION_TELEMETRY_INTERVAL_SECONDS` (default `2`)
- `CSMS_OCPP_URL` (default `ws://localhost:4000/ocpp/simulation`)
