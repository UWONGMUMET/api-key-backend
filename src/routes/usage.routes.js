import { Router } from "express";
import { currentUsageController, historyUsageController, summaryUsageController } from "../controllers/usage.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/current", currentUsageController);
router.get("/history", historyUsageController);
router.get("/summary", summaryUsageController);

export default router;