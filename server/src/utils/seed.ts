import Package from "../models/package.model";
import Delivery from "../models/delivery.model";

const packages = [
	{
		package_id: "2069b276-2680-4c85-b08c-a15ab8f22de8",
		active_delivery_id: "06e1e5cf-ec16-476f-8191-d324d84ff95f",
		description: "Electronics",
		weight: 500,
		width: 10,
		height: 5,
		depth: 2,
		from_name: "John Doe",
		from_address: "123 Elm St, Springfield, IL",
		from_location: { lat: 6.4562425, lng: 2.4277995 },
		to_name: "Jane Smith",
		to_address: "456 Oak St, Shelbyville, IL",
		to_location: { lat: 6.4562425, lng: 2.1277995 },
	},
	{
		package_id: "818c9324-1fa9-4794-b92f-5fbf1c672e9a",
		active_delivery_id: "8e40ddb6-a3f2-4fcb-a4c3-3caaff08c939",
		description: "Books",
		weight: 2000,
		width: 15,
		height: 10,
		depth: 5,
		from_name: "Alice Johnson",
		from_address: "789 Pine St, Springfield, IL",
		from_location: { lat: 6.4562425, lng: 2.4277995 },
		to_name: "Bob Brown",
		to_address: "321 Maple St, Shelbyville, IL",
		to_location: { lat: 6.2562425, lng: 2.7277995 },
	},
];

const deliveries = [
	{
		delivery_id: "06e1e5cf-ec16-476f-8191-d324d84ff95f",
		package_id: packages[0].package_id,
		pickup_time: new Date(),
		start_time: new Date(),
		end_time: null,
		location: { lat: 39.7817, lng: -89.6501 },
		status: "open",
	},
	{
		delivery_id: "8e40ddb6-a3f2-4fcb-a4c3-3caaff08c939",
		package_id: packages[1].package_id,
		pickup_time: new Date(),
		start_time: null,
		end_time: null,
		location: { lat: 39.7817, lng: -89.6501 },
		status: "open",
	},
];

export const restoredDb = async () => {
	try {
		await Package.deleteMany({});
		await Delivery.deleteMany({});

		const insertedPackages = await Package.insertMany(packages);
		const insertedDeliveries = await Delivery.insertMany(deliveries);

		console.log("Database seeded successfully");
		console.log("Inserted packages:");
		console.log("Inserted deliveries:");
	} catch (error) {
		console.error("Error seeding database:", error);
	}
};
