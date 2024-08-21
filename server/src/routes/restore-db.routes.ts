import { Router } from "express";
import { restoreSeed } from "../controllers/seed-data.controller";

const router: Router = Router();

router.post("/", restoreSeed);

export default router;
