import asyncio
import json
import websockets


async def main():
    async with websockets.connect(
        "ws://localhost:4000/ocpp/CP001"
    ) as websocket:
        boot_notification = [
            2,
            "boot-001",
            "BootNotification",
            {
                "chargingStation": {
                    "model": "Leafy Simulator",
                    "vendorName": "LeafyCharge",
                },
                "reason": "PowerUp",
            },
        ]

        await websocket.send(json.dumps(boot_notification))

        response = await websocket.recv()
        print(response)


asyncio.run(main())