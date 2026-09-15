import asyncio
import json
import logging
import uuid

import websockets
from websockets.asyncio.client import ClientConnection

logger = logging.getLogger(__name__)


class CsmsClient:
    def __init__(self, url: str) -> None:
        self._url = url
        self._task: asyncio.Task[None] | None = None
        self._socket: ClientConnection | None = None
        self._running = False

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
            logger.info("message from CSMS: %s", message)