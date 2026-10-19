import asyncio
import json
import logging
import uuid

import websockets
from websockets.asyncio.client import ClientConnection
from collections.abc import Awaitable, Callable
from typing import Any

logger = logging.getLogger(__name__)

CommandHandler = Callable[
    [str, str, dict[str, Any]],
    Awaitable[dict[str, Any] | None],
]

class CsmsClient:
    def __init__(
        self,
        url: str,
        command_handler: CommandHandler | None = None,
    ) -> None:
        self._url = url
        self._command_handler = command_handler
        self._task = None
        self._socket = None
        self._running = False
        self._transaction_sequences = {}
        
    def set_command_handler(self, handler: CommandHandler) -> None:
        self._command_handler = handler
        
    def next_transaction_sequence(self, transaction_id: str) -> int:
        sequence = self._transaction_sequences.get(transaction_id, 0)
        self._transaction_sequences[transaction_id] = sequence + 1
        return sequence

    def clear_transaction_sequence(self, transaction_id: str) -> None:
        self._transaction_sequences.pop(transaction_id, None)

    async def start(self) -> None:
        if self._running:
            return

        self._running = True
        self._task = asyncio.create_task(self._run())

    async def stop(self) -> None:
        self._running = False

        if self._socket is not None:
            await self._socket.close()
            self._socket = None

        if self._task is not None:
            self._task.cancel()
            await asyncio.gather(self._task, return_exceptions=True)
            self._task = None

    async def _run(self) -> None:
        while self._running:
            try:
                async with websockets.connect(
                    self._url,
                    subprotocols=["ocpp2.1"],
                ) as socket:
                    self._socket = socket
                    logger.info("connected to CSMS at %s", self._url)

                    await self._send_boot_notification(socket)
                    await self._listen(socket)
            except asyncio.CancelledError:
                raise
            except Exception:
                logger.exception("CSMS connection failed; retrying in 2 seconds")
                await asyncio.sleep(2)
            finally:
                self._socket = None

    async def _send_boot_notification(self, socket: ClientConnection) -> None:
        message_id = str(uuid.uuid4())

        message = [
            2,
            message_id,
            "BootNotification",
            {
                "chargingStation": {
                    "model": "LeafyCharge Simulator",
                    "vendorName": "LeafyCharge",
                },
                "reason": "PowerUp",
            },
        ]

        await socket.send(json.dumps(message))
        logger.info("BootNotification sent")

    async def _listen(self, socket: ClientConnection) -> None:
        async for raw_message in socket:
            message = json.loads(raw_message)
            message_type = message[0]

            if message_type == 2:
                _, message_id, action, payload = message

                try:
                    response = None
                    if self._command_handler is not None:
                        response = await self._command_handler(
                            message_id,
                            action,
                            payload,
                        )

                    await socket.send(json.dumps([3, message_id, response or {}]))
                except Exception as error:
                    logger.exception("OCPP command failed: %s", action)
                    await socket.send(
                        json.dumps(
                            [
                                4,
                                message_id,
                                "FormationViolation",
                                str(error),
                                {},
                            ]
                        )
                    )
                
    async def send_call(
        self,
        action: str,
        payload: dict[str, object],
    ) -> str:
        if self._socket is None:
            raise RuntimeError("CSMS WebSocket is not connected")

        message_id = str(uuid.uuid4())
        frame = [2, message_id, action, payload]

        logger.info("OCPP frame sent: %s", frame)

        await self._socket.send(json.dumps(frame))
        return message_id
    
    