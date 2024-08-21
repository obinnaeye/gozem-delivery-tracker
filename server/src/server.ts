import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import packageRoutes from "./routes/package.routes";
import deliveryRoutes from "./routes/delivery.routes";
import wss from "./websocket/websocket";
import Package from "./models/package.model";
import restoreDbRoutes from "./routes/restore-db.routes";
dotenv.config({ path: "../.env" });

const startServer = async () => {
	const app: Application = express();

	app.use(cors());
	app.use(express.json());

	const DATABASE_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
	const DATABASE_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
	const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE;
	const DATABASE_HOST = process.env.DATABASE_HOST;
	const DATABASE_PORT = process.env.DATABASE_PORT;

	const dbUri = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${MONGO_INITDB_DATABASE}?authSource=admin`;

	try {
		await mongoose.connect(dbUri);
		console.log("MongoDB connected");

		await Package.syncIndexes();

		console.log("Indexes created successfully!");
	} catch (error) {
		console.error("MongoDB connection error:", error);
	}

	app.use("/api/package", packageRoutes);
	app.use("/api/delivery", deliveryRoutes);
	app.use("/api/restore-data", restoreDbRoutes);

	const server = http.createServer(app);
	const io = new Server(server, {
		cors: {
			origin: "*",
			methods: ["GET", "POST"],
		},
	});

	io.on("connection", (socket) => {
		console.log("WebSocket connected:", socket.id);

		socket.on("disconnect", () => {
			console.log("WebSocket disconnected:", socket.id);
		});
	});

	app.set("socketio", io);

	const PORT = process.env.PORT || 5000;
	server.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});

	wss;
};

startServer();
