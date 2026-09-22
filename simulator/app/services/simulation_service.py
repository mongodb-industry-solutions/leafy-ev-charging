import asyncio
import hashlib
import logging
import random
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Any, Awaitable, Protocol

MESSAGE_TYPE_SESSION_SAMPLE = "SESSION_SAMPLE"
MESSAGE_TYPE_FAULT = "FAULT"
FAULT_PROBABILITY = 0.02
logger = logging.getLogger(__name__)


class OcppClient(Protocol):
    def next_transaction_sequence(self, transaction_id: str) -> int: ...

    def clear_transaction_sequence(self, transaction_id: str) -> None: ...

    def send_call(
        self, action: str, payload: dict[str, object]
    ) -> Awaitable[str]: ...


@dataclass(frozen=True)
class SessionTelemetryContext:
    evse_id: int
    max_kw: float


@dataclass
class SessionSimulationState:
    started_at: datetime
    last_simulated_at: datetime
    meter_start_kwh: float
    cumulative_energy_kwh: float
    soc_start_percent: float
    soc_stop_percent: float
    battery_capacity_kwh: float
    vehicle_max_power_kw: float


@dataclass(frozen=True)
class SessionAdvanceResult:
    energy_delta_kwh: float
    power_kw: float
    simulated_until: datetime
    completed_at: datetime | None



from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

def _build_telemetry_doc(
    *,
    timestamp: datetime,
    evse_id: int,
    connector_id: int,
    transaction_id: str,
    seq_no: int,
    meter_start_kwh: float,
    cumulative_energy_kwh: float,
    power_kw: float,
    voltage_v: int,
    current_a: int,
    event_type: str = "Updated",
    trigger_reason: str = "MeterValuePeriodic",
    charging_state: str = "Charging",
    stopped_reason: str | None = None,
    offline: bool = False,
) -> list[Any]:
    
    """
    OCPP 2.1 complient JSON builder
    TransactionEventRequest.json
    """
    
    assert timestamp.tzinfo is not None, "timestamp must be timezone-aware"
    assert evse_id >= 0, "evse_id must be >= 0"
    assert connector_id >= 0, "connector_id must be >= 0"

    # RFC 3339 / ISO 8601 clean UTC timestamp string
    iso_timestamp = (
        timestamp.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    )
    
    energy_register_wh = (meter_start_kwh + cumulative_energy_kwh) * 1000

    # Values matching SampledValueType (numbers are permitted in OCPP 2.1)
    sampled_values = [
        {
            "value": round(energy_register_wh, 3),
            "measurand": "Energy.Active.Import.Register",
        },
        {
            "value": round(power_kw * 1000, 2),
            "measurand": "Power.Active.Import",
            "unitOfMeasure": {"unit": "W"},
        },
        {
            "value": voltage_v,
            "measurand": "Voltage",
            "unitOfMeasure": {"unit": "V"},
        },
        {
            "value": current_a,
            "measurand": "Current.Import",
            "unitOfMeasure": {"unit": "A"},
        },
    ]

    return [
        2,  # Call Message Type
        str(uuid4()),  # MessageId
        "TransactionEvent",  # Action
        {
            "eventType": event_type,
            "timestamp": iso_timestamp,
            "triggerReason": trigger_reason,
            "seqNo": seq_no,
            "offline": offline,
            "transactionInfo": {
                "transactionId": transaction_id,
                "chargingState": charging_state,
                **({"stoppedReason": stopped_reason} if stopped_reason else {}),
            },
            "evse": {
                "id": evse_id,
                "connectorId": connector_id,
            },
            "meterValue": [
                {
                    "timestamp": iso_timestamp,
                    "sampledValue": sampled_values,
                }
            ],
        },
    ]
    
    
def _build_fault_frame(
    *,
    timestamp: datetime,
    event_id: int,
    seq_no: int,
    component_name: str,
    variable_name: str,
    actual_value: str,
    evse_id: int | None = None,
    connector_id: int | None = None,
    tech_code: str | None = None,
    tech_info: str | None = None,
    severity: int | None = None,
    cause: int | None = None,
    cleared: bool = False,
    transaction_id: str | None = None,
) -> list[Any]:
    if timestamp.tzinfo is None:
        raise ValueError("OCPP timestamps must be timezone-aware")
    moment = timestamp.isoformat().replace("+00:00", "Z")

    component: dict[str, Any] = {"name": component_name}
    if evse_id is not None:
        component["evse"] = {"id": evse_id}
        if connector_id is not None:
            component["evse"]["connectorId"] = connector_id

    event: dict[str, Any] = {
        "eventId": event_id,
        "timestamp": moment,
        "trigger": "Alerting",
        "actualValue": actual_value[:2500],
        "eventNotificationType": "HardWiredNotification",
        "component": component,
        "variable": {"name": variable_name},
    }
    optional = (
        ("techCode", tech_code[:50] if tech_code else None),
        ("techInfo", tech_info[:500] if tech_info else None),
        ("severity", severity),
        ("cause", cause),
        ("transactionId", transaction_id),
    )
    for key, value in optional:
        if value is not None:
            event[key] = value
    if cleared:
        event["cleared"] = True

    return [
        2,
        str(uuid4()),
        "NotifyEvent",
        {
            "generatedAt": moment,
            "tbc": False,
            "seqNo": seq_no,
            "eventData": [event],
        },
    ]


def _extract_max_kw(point_doc: dict[str, Any]) -> float:
    point_power = point_doc.get("power")
    if isinstance(point_power, dict):
        max_kw = point_power.get("maxKw")
        if isinstance(max_kw, (int, float)):
            return float(max_kw)

    connectors = point_doc.get("connectors")
    if isinstance(connectors, list):
        connector_powers = [
            float(connector.get("power"))
            for connector in connectors
            if isinstance(connector, dict)
            and isinstance(connector.get("power"), (int, float))
        ]
        if connector_powers:
            return max(connector_powers)

    return 22.0


def _stable_fraction(key: str) -> float:
    digest = hashlib.sha256(key.encode("utf-8")).digest()
    return int.from_bytes(digest[:8], "big") / float(1 << 64)


class SimulationService:
    def __init__(
        self,
        csms_client: OcppClient,
        telemetry_interval_seconds: float = 2.0,
    ) -> None:
        self._csms_client = csms_client
        self._telemetry_interval_seconds = max(telemetry_interval_seconds, 0.5)
        self._running = False
        self._session_tasks: dict[str, asyncio.Task[None]] = {}
        self._stop_events: dict[str, asyncio.Event] = {}

    @property
    def running(self) -> bool:
        return self._running

    async def start(self) -> bool:
        if self._running:
            logger.info("simulation service already running")
            return False

        self._running = True
        logger.info("starting simulation service")
        logger.info("simulation service started")
        return True

    async def stop(self) -> bool:
        if not self._running:
            logger.info("simulation service already stopped")
            return False

        self._running = False
        logger.info("stopping simulation service")

        running_tasks = list(self._session_tasks.items())
        self._session_tasks.clear()
        self._stop_events.clear()
        for _, task in running_tasks:
            task.cancel()
        if running_tasks:
            await asyncio.gather(
                *(task for _, task in running_tasks), return_exceptions=True
            )

        logger.info("simulation service stopped")
        return True


    async def handle_csms_command(
            self,
            message_id: str,
            action: str,
            payload: dict[str, Any],
        ) -> dict[str, Any] | None:
            if action == "RequestStartTransaction":
                transaction_id = await self.start_session_simulation(payload)
                return {
                    "status": "Accepted",
                    "transactionId": transaction_id,
                }
            if action == "RequestStopTransaction":
                transaction_id = await self.stop_session_simulation(payload)
                return {
                    "status": "Accepted",
                    "transactionId": transaction_id,
                }

            logger.warning("unsupported CSMS action: %s", action)
            return {}

    async def start_session_simulation(
            self,
            command: dict[str, Any],
        ) -> str:
            custom_data = command.get("customData")
            session_id = (
                custom_data.get("sessionId")
                if isinstance(custom_data, dict)
                else command.get("sessionId")
            )
            if not isinstance(session_id, str):
                raise ValueError("RequestStartTransaction requires sessionId")

            if not isinstance(custom_data, dict):
                raise ValueError("RequestStartTransaction requires customData")

            connector_power_kw = custom_data.get("connectorPowerKw")
            max_kw = (
                float(connector_power_kw)
                if isinstance(connector_power_kw, (int, float))
                and connector_power_kw > 0
                else 22.0
            )
            evse_id = command.get("evseId")
            await self.ensure_session_simulation_started(
                {
                    "sessionId": session_id,
                    "evseId": int(evse_id) if isinstance(evse_id, int) else 1,
                    "maxKw": max_kw,
                }
            )
            return session_id


    async def ensure_session_simulation_started(
        self, session_doc: dict[str, Any]
    ) -> None:
        session_id = session_doc.get("sessionId")
        if not isinstance(session_id, str):
            logger.warning("cannot start simulation: missing sessionId")
            return

        existing_task = self._session_tasks.get(session_id)
        if existing_task is not None and not existing_task.done():
            logger.info("session already being simulated: %s", session_id)
            return

        logger.info("starting simulation for session %s", session_id)
        task = asyncio.create_task(self._simulate_session(session_doc))
        self._session_tasks[session_id] = task
        self._stop_events[session_id] = asyncio.Event()
        task.add_done_callback(
            lambda completed_task, key=session_id: self._session_task_done(
                key, completed_task
            )
        )

    def _session_task_done(self, session_key: str, task: asyncio.Task[Any]) -> None:
        self._session_tasks.pop(session_key, None)
        self._stop_events.pop(session_key, None)
        if task.cancelled():
            return
        error = task.exception()
        if error is not None:
            logger.error(
                "session simulation stopped unexpectedly for %s: %s",
                session_key,
                error,
                exc_info=(type(error), error, error.__traceback__),
            )

    async def stop_session_simulation(self, command: dict[str, Any]) -> str:
        transaction_id = command.get("transactionId")
        if not isinstance(transaction_id, str):
            raise ValueError("RequestStopTransaction requires transactionId")

        stop_event = self._stop_events.get(transaction_id)
        if stop_event is None:
            raise ValueError(f"transaction is not running: {transaction_id}")

        logger.info("stop requested for session %s", transaction_id)
        stop_event.set()
        return transaction_id

    async def _build_session_context(
        self, session_doc: dict[str, Any]
    ) -> SessionTelemetryContext | None:
        evse_id = session_doc.get("evseId")
        max_kw = session_doc.get("maxKw")
        if not isinstance(evse_id, int) or not isinstance(max_kw, (int, float)):
            logger.warning("cannot build simulation context: invalid command data")
            return None

        return SessionTelemetryContext(evse_id=evse_id, max_kw=float(max_kw))

    async def _simulate_session(self, session_doc: dict[str, Any]) -> None:
        session_id = session_doc.get("sessionId")
        if not isinstance(session_id, str):
            logger.warning("cannot simulate session with invalid sessionId: %s", session_id)
            return

        context = await self._build_session_context(session_doc)
        if context is None:
            logger.warning("session %s skipped: context unavailable", session_id)
            return

        logger.info(
            "session %s simulation loop started evse=%s",
            session_id,
            context.evse_id,
        )
        state = self._build_initial_session_state(session_doc)
        interval = self._telemetry_interval_seconds
        transaction_id = session_id
        stop_event = self._stop_events[transaction_id]

        started_seq_no = self._csms_client.next_transaction_sequence(transaction_id)
        started_frame = _build_telemetry_doc(
            timestamp=state.started_at,
            evse_id=context.evse_id,
            connector_id=1,
            transaction_id=transaction_id,
            seq_no=started_seq_no,
            meter_start_kwh=state.meter_start_kwh,
            cumulative_energy_kwh=state.cumulative_energy_kwh,
            power_kw=0.0,
            voltage_v=0,
            current_a=0,
            event_type="Started",
            trigger_reason="Authorized",
            charging_state="Charging",
        )
        await self._csms_client.send_call(
            action=started_frame[2],
            payload=started_frame[3],
        )

        while self._running:
            try:
                if stop_event.is_set():
                    await self._send_ended_event(
                        timestamp=datetime.now(UTC),
                        context=context,
                        state=state,
                        transaction_id=transaction_id,
                        trigger_reason="RemoteStop",
                        stopped_reason="Remote",
                    )
                    self._csms_client.clear_transaction_sequence(transaction_id)
                    return

                previous_simulated_at = state.last_simulated_at
                advance = self._advance_session_state(
                    state=state,
                    context=context,
                    target_timestamp=datetime.now(UTC),
                    step_seconds=interval,
                )

                if advance.completed_at is not None or self._is_state_full(state):
                    ended_at = advance.completed_at or state.last_simulated_at
                    await self._send_ended_event(
                        timestamp=ended_at,
                        context=context,
                        state=state,
                        transaction_id=transaction_id,
                        trigger_reason="EnergyLimitReached",
                        stopped_reason="EnergyLimitReached",
                    )

                    self._csms_client.clear_transaction_sequence(transaction_id)
                    return

                if advance.simulated_until > previous_simulated_at:
                    voltage = 400 if context.max_kw <= 50 else 800
                    current_a = (
                        int(advance.power_kw * 1000 / voltage)
                        if voltage and advance.power_kw > 0
                        else 0
                    )
                    
                    seq_no = self._csms_client.next_transaction_sequence(transaction_id)

                    frame = _build_telemetry_doc(
                        timestamp=advance.simulated_until,
                        evse_id=context.evse_id,
                        connector_id=1,
                        transaction_id=transaction_id,
                        seq_no=seq_no,
                        meter_start_kwh=state.meter_start_kwh,
                        cumulative_energy_kwh=state.cumulative_energy_kwh,
                        power_kw=advance.power_kw,
                        voltage_v=voltage,
                        current_a=current_a,
                    )
                    await self._csms_client.send_call(
                        action=frame[2],
                        payload=frame[3],
                    )
                    

                    if random.random() < FAULT_PROBABILITY:
                        fault_seq_no = self._csms_client.next_transaction_sequence(transaction_id)

                        fault_frame = _build_fault_frame(
                            timestamp=advance.simulated_until,
                            event_id=1,
                            seq_no=fault_seq_no,
                            component_name="EVSE",
                            variable_name="Temperature",
                            actual_value="E_OVERHEAT_WARN",
                            evse_id=context.evse_id,
                            connector_id=1,
                            tech_code="E_OVERHEAT_WARN",
                            tech_info="Temperature threshold exceeded",
                            severity=3,
                            transaction_id=transaction_id,
                        )

                        await self._csms_client.send_call(
                            action=fault_frame[2],
                            payload=fault_frame[3],
                        )
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("session tick failed for session %s", session_id)
            try:
                await asyncio.wait_for(
                    stop_event.wait(),
                    timeout=self._seconds_until_next_tick(state, interval),
                )
            except TimeoutError:
                pass

        logger.info("session %s simulation loop exiting", session_id)

    async def _send_ended_event(
        self,
        *,
        timestamp: datetime,
        context: SessionTelemetryContext,
        state: SessionSimulationState,
        transaction_id: str,
        trigger_reason: str,
        stopped_reason: str,
    ) -> None:
        seq_no = self._csms_client.next_transaction_sequence(transaction_id)
        frame = _build_telemetry_doc(
            timestamp=timestamp,
            evse_id=context.evse_id,
            connector_id=1,
            transaction_id=transaction_id,
            seq_no=seq_no,
            meter_start_kwh=state.meter_start_kwh,
            cumulative_energy_kwh=state.cumulative_energy_kwh,
            power_kw=0.0,
            voltage_v=0,
            current_a=0,
            event_type="Ended",
            trigger_reason=trigger_reason,
            charging_state="Idle",
            stopped_reason=stopped_reason,
        )
        await self._csms_client.send_call(action=frame[2], payload=frame[3])

    def _build_initial_session_state(
        self, session_doc: dict[str, Any]
    ) -> SessionSimulationState:
        session_key = str(session_doc.get("sessionId", "session"))

        started_at = datetime.now(UTC)
        last_simulated_at = started_at
        meter_start_kwh = round(
            8_000 + _stable_fraction(f"{session_key}:meter-start") * 52_000,
            3,
        )
        cumulative_energy_kwh = 0.0
        soc_start_percent = round(
            15 + _stable_fraction(f"{session_key}:soc-start") * 50,
            1,
        )
        soc_stop_percent = soc_start_percent
        battery_capacity_kwh = 40 + _stable_fraction(
            f"{session_key}:battery-capacity"
        ) * 60

        vehicle_profile = _stable_fraction(f"{session_key}:vehicle-profile")
        if vehicle_profile < 0.6:
            vehicle_max_power_kw = (
                50.0
                if _stable_fraction(f"{session_key}:vehicle-standard") < 0.5
                else 100.0
            )
        elif vehicle_profile < 0.9:
            vehicle_max_power_kw = 150.0
        else:
            vehicle_max_power_kw = 250.0

        return SessionSimulationState(
            started_at=started_at,
            last_simulated_at=last_simulated_at,
            meter_start_kwh=meter_start_kwh,
            cumulative_energy_kwh=cumulative_energy_kwh,
            soc_start_percent=soc_start_percent,
            soc_stop_percent=max(soc_stop_percent, soc_start_percent),
            battery_capacity_kwh=round(battery_capacity_kwh, 2),
            vehicle_max_power_kw=vehicle_max_power_kw,
        )

    def _is_state_full(self, state: SessionSimulationState) -> bool:
        return max(state.soc_stop_percent, state.soc_start_percent) >= 100.0

    def _seconds_until_next_tick(
        self, state: SessionSimulationState, interval_seconds: float
    ) -> float:
        elapsed = max(
            (datetime.now(UTC) - state.last_simulated_at).total_seconds(),
            0.0,
        )
        return max(min(interval_seconds - elapsed, interval_seconds), 0.5)

    def _calculate_power_kw(
        self,
        context: SessionTelemetryContext,
        state: SessionSimulationState,
        current_soc: float,
    ) -> float:
        if current_soc >= 100.0:
            return 0.0

        taper_factor = 1.0 if current_soc < 80.0 else max(
            0.0, (100.0 - current_soc) / 20.0
        )

        station_max = context.max_kw
        vehicle_limit = state.vehicle_max_power_kw
        if station_max < 40.0:
            vehicle_ac_limit = 22.0 if vehicle_limit >= 150.0 else 11.0
            effective_max_kw = min(station_max, vehicle_ac_limit)
        else:
            effective_max_kw = min(station_max, vehicle_limit)

        return round(max(effective_max_kw * 0.9 * taper_factor, 0.0), 2)

    def _advance_session_state(
        self,
        *,
        state: SessionSimulationState,
        context: SessionTelemetryContext,
        target_timestamp: datetime,
        step_seconds: float,
    ) -> SessionAdvanceResult:
        target = max(target_timestamp, state.last_simulated_at)
        total_energy_delta = 0.0
        power_kw = 0.0
        completed_at: datetime | None = None

        while state.last_simulated_at < target:
            current_soc = max(
                min(max(state.soc_stop_percent, state.soc_start_percent), 100.0),
                0.0,
            )
            if current_soc >= 100.0:
                state.soc_stop_percent = 100.0
                completed_at = state.last_simulated_at
                break

            chunk_end = min(
                state.last_simulated_at + timedelta(seconds=step_seconds),
                target,
            )
            elapsed_hours = max(
                (chunk_end - state.last_simulated_at).total_seconds() / 3600.0,
                0.0,
            )
            power_kw = self._calculate_power_kw(context, state, current_soc)
            max_energy_to_full = (
                max(100.0 - current_soc, 0.0) / 100.0
            ) * max(state.battery_capacity_kwh, 1.0)
            energy_delta = min(power_kw * elapsed_hours, max_energy_to_full)

            if energy_delta > 0:
                total_energy_delta += energy_delta
                state.cumulative_energy_kwh = max(
                    state.cumulative_energy_kwh + energy_delta,
                    0.0,
                )
                soc_gain = (energy_delta / max(state.battery_capacity_kwh, 1.0)) * 100.0
                state.soc_stop_percent = min(
                    100.0,
                    max(state.soc_stop_percent, state.soc_start_percent) + soc_gain,
                )

            state.last_simulated_at = chunk_end
            if max_energy_to_full <= energy_delta + 1e-9:
                state.soc_stop_percent = 100.0
                completed_at = chunk_end
                break

        return SessionAdvanceResult(
            energy_delta_kwh=round(total_energy_delta, 4),
            power_kw=0.0 if completed_at is not None else power_kw,
            simulated_until=state.last_simulated_at,
            completed_at=completed_at,
        )

