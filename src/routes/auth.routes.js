import express from "express";
import * as c from "../controllers/auth.controller.js";
import { authRateLimit } from "../middlewares/rateLimiter.middleware.js";

const router = express.Router();

router.post("/register", authRateLimit, c.register);
router.post("/login", authRateLimit, c.login);

export default router;