import os
from dataclasses import dataclass
from urllib.parse import urlparse

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    simulator_url: str
    bind_port: int
    session_telemetry_interval_seconds: float
    csms_ocpp_url: str


def _port_from_url(url: str, default: int = 8000) -> int:
    try:
        parsed = urlparse(url)
        return int(parsed.port) if parsed.port else default
    except (ValueError, TypeError):
        return default


def get_settings() -> Settings:
    simulator_url = os.getenv("SIMULATOR_URL", "http://localhost:8000")
    return Settings(
        simulator_url=simulator_url,
        bind_port=_port_from_url(simulator_url),
        session_telemetry_interval_seconds=float(
            os.getenv(
                "SESSION_TELEMETRY_INTERVAL_SECONDS",
                os.getenv("SIMULATION_INTERVAL_SECONDS", "2"),
            )
        ),
        csms_ocpp_url=os.getenv(
            "CSMS_OCPP_URL",
            "ws://localhost:4000/ocpp/simulation",
        ),
    )
