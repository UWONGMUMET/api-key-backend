import express from "express";
import * as keyController from "../controllers/key.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, keyController.createKey);
router.get("/", authMiddleware, keyController.listKey);
router.delete("/:id", authMiddleware, keyController.revokeKey);

export default router;