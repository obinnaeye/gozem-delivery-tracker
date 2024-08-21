import mongoose, { Schema, Document } from "mongoose";

interface ILocation {
	lat: number;
	lng: number;
}

export interface IPackage extends Document {
	package_id: string;
	active_delivery_id?: string;
	description: string;
	weight: number; // in grams
	width: number; // in cm
	height: number; // in cm
	depth: number; // in cm
	from_name: string;
	from_address: string;
	from_location: ILocation;
	to_name: string;
	to_address: string;
	to_location: ILocation;
}

const packageSchema: Schema = new Schema({
	package_id: {
		type: String,
		required: true,
		unique: true,
	},
	active_delivery_id: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: true,
	},
	weight: {
		type: Number, // Weight in grams
		required: true,
	},
	width: {
		type: Number, // Width in centimeters
		required: true,
	},
	height: {
		type: Number, // Height in centimeters
		required: true,
	},
	depth: {
		type: Number, // Depth in centimeters
		required: true,
	},
	from_name: {
		type: String,
		required: true,
	},
	from_address: {
		type: String,
		required: true,
	},
	from_location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	to_name: {
		type: String,
		required: true,
	},
	to_address: {
		type: String,
		required: true,
	},
	to_location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
});

packageSchema.index(
	{
		description: "text",
		package_id: "text",
		from_name: "text",
		to_name: "text",
	},
	{ unique: false }
);

export default mongoose.model<IPackage>("Package", packageSchema);
