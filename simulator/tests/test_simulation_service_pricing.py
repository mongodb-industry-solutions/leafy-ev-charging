from datetime import UTC, datetime, timedelta
import unittest
from unittest.mock import MagicMock

from app.services.simulation_service import (
    SessionSimulationState,
    SessionTelemetryContext,
    SimulationService,
)


class FakeOcppClient:
    def __init__(self) -> None:
        self.frames: list[tuple[str, dict[str, object]]] = []
        self.sequences: dict[str, int] = {}

    def next_transaction_sequence(self, transaction_id: str) -> int:
        sequence = self.sequences.get(transaction_id, 0)
        self.sequences[transaction_id] = sequence + 1
        return sequence

    def clear_transaction_sequence(self, transaction_id: str) -> None:
        self.sequences.pop(transaction_id, None)

    async def send_call(self, action: str, payload: dict[str, object]) -> str:
        self.frames.append((action, payload))
        return "message-id"


class SimulationServiceTests(unittest.IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.service = SimulationService(MagicMock())

    def test_initial_state_is_deterministic_for_session(self) -> None:
        first = self.service._build_initial_session_state({"sessionId": "session-1"})
        second = self.service._build_initial_session_state({"sessionId": "session-1"})

        self.assertEqual(first.meter_start_kwh, second.meter_start_kwh)
        self.assertEqual(first.soc_start_percent, second.soc_start_percent)
        self.assertEqual(first.battery_capacity_kwh, second.battery_capacity_kwh)

    def test_advance_session_increases_energy(self) -> None:
        timestamp = datetime(2026, 3, 10, 9, 0, tzinfo=UTC)
        state = SessionSimulationState(
            started_at=timestamp - timedelta(minutes=20),
            last_simulated_at=timestamp,
            meter_start_kwh=1000.0,
            cumulative_energy_kwh=12.0,
            soc_start_percent=20.0,
            soc_stop_percent=55.0,
            battery_capacity_kwh=60.0,
            vehicle_max_power_kw=50.0,
        )
        context = SessionTelemetryContext(evse_id=1, max_kw=50.0)

        result = self.service._advance_session_state(
            state=state,
            context=context,
            target_timestamp=timestamp + timedelta(minutes=1),
            step_seconds=2.0,
        )

        self.assertGreater(result.energy_delta_kwh, 0)
        self.assertGreater(state.cumulative_energy_kwh, 12.0)

    async def test_stop_command_emits_remote_stop_event(self) -> None:
        client = FakeOcppClient()
        service = SimulationService(client, telemetry_interval_seconds=60)
        await service.start()
        await service.start_session_simulation(
            {
                "evseId": 1,
                "customData": {
                    "sessionId": "session-1",
                    "connectorPowerKw": 22,
                },
            }
        )

        await service.stop_session_simulation({"transactionId": "session-1"})
        task = service._session_tasks["session-1"]
        await task

        ended_events = [
            payload
            for action, payload in client.frames
            if action == "TransactionEvent" and payload["eventType"] == "Ended"
        ]
        self.assertEqual(len(ended_events), 1)
        self.assertEqual(ended_events[0]["triggerReason"], "RemoteStop")
        await service.stop()


if __name__ == "__main__":
    unittest.main()
