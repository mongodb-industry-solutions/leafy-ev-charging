import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.simulation_service import SimulationService
from app.config import get_settings
from app.services.csms_client import CsmsClient

settings = get_settings()
csms_client = CsmsClient(settings.csms_ocpp_url)


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
async def start_simulation_service() -> None:
    await csms_client.start()


@app.on_event("shutdown")
async def stop_simulation_service() -> None:
    await csms_client.stop()


@app.get("/health")
async def health() -> dict[str, bool]:
    return {"ok": True}
