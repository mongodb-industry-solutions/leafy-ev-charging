from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database

from app.config import get_settings

_client: MongoClient | None = None


def get_client() -> MongoClient:
    global _client
    if _client is None:
        settings = get_settings()
        _client = MongoClient(settings.mongodb_uri)
    return _client


def get_database() -> Database:
    settings = get_settings()
    return get_client()[settings.mongodb_database]

# This is going to be sent via websocket to the CSMS
def get_telemetry_collection() -> Collection:
    return get_database()["telemetry"]

# One of these 2 is what I need to be able to ac

def get_charging_points_collection() -> Collection:
    return get_database()["chargingPoints"]


def get_charging_stations_collection() -> Collection:
    return get_database()["chargingStations"]

# This is going to be handled by the CSMS
def get_charging_sessions_collection() -> Collection:
    return get_database()["chargingSessions"]
