import { Request, Response } from "express";
import { restoredDb } from "../utils/seed";

export const restoreSeed = async (req: Request, res: Response) => {
	try {
		if (process.env.NODE_ENV === "production") {
			return res
				.status(403)
				.json({ message: "Forbidden in production environment" });
		}
		await restoredDb();
		res.status(200).json({
			message: "Database restored to seed data",
		});
	} catch (error) {
		res.status(500).json({ message: "Error restoring database", error });
	}
};
