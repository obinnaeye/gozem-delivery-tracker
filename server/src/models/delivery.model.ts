import mongoose, { Schema, Document } from "mongoose";

interface ILocation {
	lat: number;
	lng: number;
}

export interface IDelivery extends Document {
	delivery_id: string;
	package_id: string;
	pickup_time?: Date;
	start_time?: Date;
	end_time?: Date;
	location?: ILocation;
	status: "open" | "picked-up" | "in-transit" | "delivered" | "failed";
}

const deliverySchema: Schema = new Schema({
	delivery_id: {
		type: String,
		required: true,
		unique: true,
	},
	package_id: {
		type: String,
		required: true,
	},
	pickup_time: {
		type: Date,
		required: false,
	},
	start_time: {
		type: Date,
		required: false,
	},
	end_time: {
		type: Date,
		required: false,
	},
	location: {
		lat: { type: Number, required: false },
		lng: { type: Number, required: false },
	},
	status: {
		type: String,
		enum: ["open", "picked-up", "in-transit", "delivered", "failed"],
		default: "open",
		required: true,
	},
});

export default mongoose.model<IDelivery>("Delivery", deliverySchema);
