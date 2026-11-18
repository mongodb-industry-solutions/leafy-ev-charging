import asyncio
from datetime import UTC, datetime, timedelta
import unittest
from unittest.mock import MagicMock, patch

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
        self.assertIsNone(result.completed_at)

    def test_near_full_session_reaches_stop_threshold_without_overcharging(self) -> None:
        timestamp = datetime(2026, 3, 10, 9, 0, tzinfo=UTC)
        for max_kw in (7.4, 22.0, 50.0, 350.0):
            with self.subTest(max_kw=max_kw):
                state = SessionSimulationState(
                    started_at=timestamp,
                    last_simulated_at=timestamp,
                    meter_start_kwh=1000.0,
                    cumulative_energy_kwh=0.0,
                    soc_start_percent=99.89,
                    soc_stop_percent=99.89,
                    battery_capacity_kwh=60.0,
                    vehicle_max_power_kw=250.0,
                )
                result = self.service._advance_session_state(
                    state=state,
                    context=SessionTelemetryContext(evse_id=1, max_kw=max_kw),
                    target_timestamp=timestamp + timedelta(hours=1),
                    step_seconds=2.0,
                )

                self.assertIsNotNone(result.completed_at)
                self.assertEqual(state.soc_stop_percent, 99.9)
                self.assertAlmostEqual(state.cumulative_energy_kwh, 0.006)
                self.assertEqual(result.power_kw, 0.0)

    async def test_session_at_stop_threshold_emits_ended_and_cleans_up(self) -> None:
        for soc in (99.9, 99.999, 100.0):
            with self.subTest(soc=soc):
                client = FakeOcppClient()
                service = SimulationService(client)
                timestamp = datetime.now(UTC)
                state = SessionSimulationState(
                    started_at=timestamp,
                    last_simulated_at=timestamp,
                    meter_start_kwh=1000.0,
                    cumulative_energy_kwh=0.0,
                    soc_start_percent=soc,
                    soc_stop_percent=soc,
                    battery_capacity_kwh=60.0,
                    vehicle_max_power_kw=50.0,
                )
                await service.start()
                try:
                    with (
                        patch.object(service, "_build_initial_session_state", return_value=state),
                        patch("app.services.simulation_service.datetime", wraps=datetime) as clock,
                    ):
                        clock.now.return_value = timestamp
                        await service.start_session_simulation({
                            "evseId": 1,
                            "customData": {"sessionId": "session-1", "connectorPowerKw": 22},
                        })
                        await asyncio.wait_for(service._session_tasks["session-1"], timeout=1)

                    self.assertEqual([action for action, _ in client.frames],
                                     ["TransactionEvent", "TransactionEvent"])
                    started, ended = [payload for _, payload in client.frames]
                    self.assertEqual(started["eventType"], "Started")
                    self.assertEqual(ended["eventType"], "Ended")
                    self.assertEqual(ended["triggerReason"], "EnergyLimitReached")
                    self.assertEqual(ended["transactionInfo"]["stoppedReason"], "EnergyLimitReached")
                    self.assertEqual(ended["transactionInfo"]["chargingState"], "Idle")
                    self.assertEqual(ended["seqNo"], 1)
                    self.assertEqual(state.soc_stop_percent, soc)
                    self.assertNotIn("session-1", client.sequences)
                    self.assertNotIn("session-1", service._session_tasks)
                    self.assertNotIn("session-1", service._stop_events)
                finally:
                    await service.stop()

    async def test_session_past_time_limit_emits_time_limit_ended_event(self) -> None:
        client = FakeOcppClient()
        service = SimulationService(client, max_session_duration_seconds=45 * 60)
        state = service._build_initial_session_state({"sessionId": "session-1"})
        state.soc_start_percent = state.soc_stop_percent = 10.0
        state.battery_capacity_kwh = 100.0

        await service.start()
        try:
            with (
                patch.object(service, "_build_initial_session_state", return_value=state),
                patch("app.services.simulation_service.datetime", wraps=datetime) as clock,
            ):
                clock.now.return_value = state.started_at + timedelta(minutes=50)
                await service.start_session_simulation({
                    "evseId": 1,
                    "customData": {"sessionId": "session-1", "connectorPowerKw": 7.4},
                })
                await asyncio.wait_for(service._session_tasks["session-1"], timeout=1)

            self.assertEqual([payload["eventType"] for _, payload in client.frames],
                             ["Started", "Ended"])
            ended = client.frames[-1][1]
            self.assertEqual(ended["triggerReason"], "TimeLimitReached")
            self.assertEqual(ended["transactionInfo"]["stoppedReason"], "TimeLimitReached")
            self.assertEqual(state.last_simulated_at, state.started_at + timedelta(minutes=45))
            self.assertLess(state.soc_stop_percent, 99.9)
            self.assertNotIn("session-1", service._session_tasks)
        finally:
            await service.stop()

    async def test_telemetry_does_not_emit_simulated_faults(self) -> None:
        client = FakeOcppClient()
        service = SimulationService(client)
        state = service._build_initial_session_state({"sessionId": "session-1"})
        send_call = client.send_call

        async def send_and_stop(action: str, payload: dict[str, object]) -> str:
            message_id = await send_call(action, payload)
            if action == "TransactionEvent" and payload["eventType"] == "Updated":
                await service.stop_session_simulation({"transactionId": "session-1"})
            return message_id

        await service.start()
        try:
            with (
                patch.object(service, "_build_initial_session_state", return_value=state),
                patch.object(client, "send_call", side_effect=send_and_stop),
                patch("app.services.simulation_service.datetime", wraps=datetime) as clock,
                patch("random.random", return_value=0.0),
            ):
                clock.now.return_value = state.started_at + timedelta(seconds=2)
                await service.start_session_simulation({
                    "evseId": 1,
                    "customData": {"sessionId": "session-1", "connectorPowerKw": 22},
                })
                await asyncio.wait_for(service._session_tasks["session-1"], timeout=1)

            self.assertEqual([action for action, _ in client.frames],
                             ["TransactionEvent"] * 3)
            self.assertEqual([payload["eventType"] for _, payload in client.frames],
                             ["Started", "Updated", "Ended"])
            self.assertEqual([payload["seqNo"] for _, payload in client.frames], [0, 1, 2])
        finally:
            await service.stop()

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
    async def test_unservable_commands_are_rejected_not_errored(self) -> None:
        service = SimulationService(FakeOcppClient())
        await service.start()
        try:
            cases = (
                ("RequestStopTransaction", {"transactionId": "unknown"}, "UnknownTransaction"),
                ("RequestStartTransaction", {"evseId": 1, "idToken": {}}, "MissingSessionId"),
            )
            for action, payload, reason_code in cases:
                with self.subTest(action=action):
                    response = await service.handle_csms_command("id", action, payload)
                    self.assertEqual(response["status"], "Rejected")
                    self.assertEqual(response["statusInfo"]["reasonCode"], reason_code)

            with self.assertRaises(ValueError):
                await service.handle_csms_command("id", "RequestStopTransaction", {})
        finally:
            await service.stop()


if __name__ == "__main__":
    unittest.main()
