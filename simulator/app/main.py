import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.simulation_service import SimulationService
from app.config import get_settings
from app.services.csms_client import CsmsClient
from app.services.simulation_service import SimulationService

settings = get_settings()

csms_client = CsmsClient(settings.csms_ocpp_url)
simulation_service = SimulationService(
    csms_client,
    settings.session_telemetry_interval_seconds,
)

csms_client.set_command_handler(
    simulation_service.handle_csms_command
)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s - %(message)s",
)

app = FastAPI(title="EV Charging Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def start_services() -> None:
    await csms_client.start()
    await simulation_service.start()

@app.on_event("shutdown")
async def stop_services() -> None:
    await simulation_service.stop()
    await csms_client.stop()


@app.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True}
