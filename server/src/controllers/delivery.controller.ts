import { Request, Response } from "express";
import Delivery, { IDelivery } from "../models/delivery.model";
import Package from "../models/package.model";
import { v4 as uuidv4 } from "uuid";

export const getAllDeliveries = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const deliveries = await Delivery.find();
		res.status(200).json(deliveries);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch deliveries" });
	}
};

export const getDeliveryById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const deliveryId = req.params.id;
		const delivery = await Delivery.findOne({ delivery_id: deliveryId });
		if (!delivery) {
			res.status(404).json({ message: "Delivery not found" });
			return;
		}
		res.status(200).json(delivery);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch the delivery" });
	}
};

export const createDelivery = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { package_id } = req.body;

		const delivery_id = uuidv4();

		const newDelivery: IDelivery = new Delivery({
			delivery_id,
			package_id,
		});

		await newDelivery.save();
		await Package.findOneAndUpdate(
			{ package_id },
			{ active_delivery_id: delivery_id }
		);
		res.status(201).json(newDelivery);
	} catch (error) {
		res.status(500).json({ error: "Failed to create delivery" });
	}
};

export const updateDelivery = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const deliveryId = req.params.id;
		const updatedDelivery = await Delivery.findOneAndUpdate(
			{ delivery_id: deliveryId },
			req.body,
			{ new: true }
		);

		if (!updatedDelivery) {
			res.status(404).json({ message: "Delivery not found" });
			return;
		}

		res.status(200).json(updatedDelivery);
	} catch (error) {
		res.status(500).json({ error: "Failed to update delivery" });
	}
};

export const deleteDelivery = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const deliveryId = req.params.id;
		const deletedDelivery = await Delivery.findOneAndDelete({
			delivery_id: deliveryId,
		});

		if (!deletedDelivery) {
			res.status(404).json({ message: "Delivery not found" });
			return;
		}

		res.status(200).json({ message: "Delivery deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete delivery" });
	}
};
