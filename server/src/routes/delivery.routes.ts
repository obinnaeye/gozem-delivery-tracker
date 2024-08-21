import { Router } from "express";
import {
	getAllDeliveries,
	getDeliveryById,
	createDelivery,
	updateDelivery,
	deleteDelivery,
} from "../controllers/delivery.controller";

const router: Router = Router();

router.get("/", getAllDeliveries);

router.get("/:id", getDeliveryById);

router.post("/", createDelivery);

router.put("/:id", updateDelivery);

router.delete("/:id", deleteDelivery);

export default router;
