# Simulator (FastAPI)

FastAPI service that receives OCPP commands from the CSMS and emits simulated OCPP transaction events.

On startup, it:

- connects to the backend CSMS over OCPP 2.1 WebSockets
- starts a simulation after `RequestStartTransaction`
- emits `TransactionEvent` lifecycle and meter updates
- prevents duplicate simulations for the same session ID

## Session Lifecycle

- Sessions start when the CSMS sends `RequestStartTransaction`.
- Sessions automatically finish at 99.9% state of charge, sending an `Ended`
  transaction event with reason `EnergyLimitReached`. This avoids stalling near
  100% as charging power tapers and rounds to zero.
- Sessions automatically finish after `SESSION_MAX_DURATION_MINUTES` (default
  45) with reason `TimeLimitReached`, even below 99.9%.
- `RequestStopTransaction` ends a session early with reason `Remote`.
- Simulation uses real elapsed time; the telemetry interval controls update
  frequency, not charging speed.
- Random overheating/fault notifications are not generated. OCPP requires a
  reply to every command, so the simulator still answers commands it can't
  carry out:
  - Well-formed requests it can't act on, such as a `RequestStopTransaction`
    for a session it isn't running or a `RequestStartTransaction` without the
    simulator-specific `customData.sessionId`, get the command's normal
    response with `status: "Rejected"` and a `statusInfo.reasonCode`.
  - Structurally invalid calls, such as a `RequestStopTransaction` without
    `transactionId`, or unexpected internal failures get an OCPP `CallError`.
- The shared OCPP WebSocket stays connected between sessions. An `Ended` event
  completes the session and lets the CSMS release the charging point.

The CSMS's 30-minute booking expiry applies before charging starts, not to an
active session. As a safety net, the CSMS also completes any session still
`ACTIVE` two minutes past the time limit (for example, after a simulator restart)
and releases its charging point. The driver UI picks up the change via polling.

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
- `SESSION_MAX_DURATION_MINUTES` (default `45`; also read by the CSMS)
- `CSMS_OCPP_URL` (default `ws://localhost:4000/ocpp/simulation`)
