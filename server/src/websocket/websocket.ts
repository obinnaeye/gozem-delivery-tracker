import WebSocket, { WebSocketServer } from "ws";
import Delivery from "../models/delivery.model";
import { IDelivery } from "../models/delivery.model";

const wss = new WebSocketServer({ port: 8080 });

const broadcast = (data: string) => {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

wss.on("connection", (ws: WebSocket) => {
	console.log("New client connected");

	ws.on("message", async (message: string) => {
		try {
			const data = JSON.parse(message);

			if (data.event === "location_changed") {
				await handleLocationChanged(ws, data);
			} else if (data.event === "status_changed") {
				await handleStatusChanged(ws, data);
			}
		} catch (error) {
			console.error("Error parsing message", error);
		}
	});

	ws.on("close", () => {
		console.log("Client disconnected");
	});
});

const handleLocationChanged = async (ws: WebSocket, data: any) => {
	const { delivery_id, location } = data;

	const delivery = await Delivery.findOneAndUpdate(
		{ delivery_id },
		{ location },
		{ new: true }
	);

	if (delivery) {
		broadcastDeliveryUpdated(delivery);
	}
};

const handleStatusChanged = async (ws: WebSocket, data: any) => {
	const { delivery_id, status } = data;
	let updateFields: any = { status };

	if (status === "picked-up") {
		updateFields.pickup_time = new Date();
	} else if (status === "in-transit") {
		updateFields.start_time = new Date();
	} else if (status === "delivered" || status === "failed") {
		updateFields.end_time = new Date();
	}

	const delivery = await Delivery.findOneAndUpdate(
		{ delivery_id },
		updateFields,
		{ new: true }
	);

	if (delivery) {
		broadcastDeliveryUpdated(delivery);
	}
};

const broadcastDeliveryUpdated = (delivery: IDelivery) => {
	const payload = {
		event: "delivery_updated",
		delivery_object: delivery,
	};

	broadcast(JSON.stringify(payload));
};

export default wss;
