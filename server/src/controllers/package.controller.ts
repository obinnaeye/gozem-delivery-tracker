import { Request, Response } from "express";
import Package, { IPackage } from "../models/package.model";
import { v4 as uuidv4 } from "uuid";
import Delivery from "../models/delivery.model";

export const getAllPackages = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const packages = await Package.find();
		res.status(200).json(packages);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch packages" });
	}
};

export const getPackageById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const packageId = req.params.id;
		const pkg = await Package.findOne({ package_id: packageId });
		if (!pkg) {
			res.status(404).json({ message: "Package not found" });
			return;
		}
		res.status(200).json(pkg);
	} catch (error) {
		res.status(500).json({ error: "Failed to fetch the package" });
	}
};

export const createPackage = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			description,
			weight,
			width,
			height,
			depth,
			from_name,
			from_address,
			from_location_lat,
			from_location_lng,
			to_name,
			to_address,
			to_location_lat,
			to_location_lng,
		} = req.body;

		const newPackage: IPackage = new Package({
			package_id: uuidv4(),
			active_delivery_id: "",
			description,
			weight,
			width,
			height,
			depth,
			from_name,
			from_address,
			from_location: {
				lat: from_location_lat,
				lng: from_location_lng,
			},
			to_name,
			to_address,
			to_location: {
				lat: to_location_lat,
				lng: to_location_lng,
			},
		});

		await newPackage.save();
		res.status(201).json(newPackage);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to create package" });
	}
};

export const updatePackage = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const packageId = req.params.id;
		const updatedPackage = await Package.findOneAndUpdate(
			{ package_id: packageId },
			req.body,
			{ new: true }
		);

		if (!updatedPackage) {
			res.status(404).json({ message: "Package not found" });
			return;
		}

		res.status(200).json(updatedPackage);
	} catch (error) {
		res.status(500).json({ error: "Failed to update package" });
	}
};

export const deletePackage = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const packageId = req.params.id;
		const deletedPackage = await Package.findOneAndDelete({
			package_id: packageId,
		});

		if (!deletedPackage) {
			res.status(404).json({ message: "Package not found" });
			return;
		}

		res.status(200).json({ message: "Package deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Failed to delete package" });
	}
};

export const searchPackages = async (req: Request, res: Response) => {
	try {
		const searchQuery: string = req.query.q ? (req.query.q as string) : "";

		let packages = await Package.find({
			$text: {
				$search: searchQuery,
				$caseSensitive: false,
				$language: "none",
			},
		});

		if (req.query.isOpen) {
			const package_ids = packages.map((pkg) => pkg.package_id);
			const deliveries = await Delivery.find({
				package_id: { $in: package_ids },
				status: {
					$ne: "failed",
				},
			});
			const delivery_pk_ids = deliveries.map(
				(delivery) => delivery.package_id
			);
			const filteredPackages = packages.filter((pkg) => {
				if (!pkg.active_delivery_id) {
					return true;
				}
				return !delivery_pk_ids.includes(pkg.package_id);
			});
			res.status(200).json(filteredPackages);
		} else {
			res.status(200).json(packages);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Error searching for packages",
			error,
		});
	}
};
