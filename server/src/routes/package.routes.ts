import { Router } from "express";
import {
	getAllPackages,
	getPackageById,
	createPackage,
	updatePackage,
	deletePackage,
	searchPackages,
} from "../controllers/package.controller";

const router: Router = Router();

router.get("/", getAllPackages);

router.get("/search", searchPackages);

router.get("/:id", getPackageById);

router.post("/", createPackage);

router.put("/:id", updatePackage);

router.delete("/:id", deletePackage);

export default router;
