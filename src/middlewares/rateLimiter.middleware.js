import rateLimit from "express-rate-limit";
import { config } from "../config/config.js";

const createLimiter = (options) =>
    rateLimit({
        windowMs: options.windowMs,
        max: options.max,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: "Too many requests, please try again later."
            });
        }
    });

export const globalRateLimit = createLimiter(config.rateLimit.global);
export const authRateLimit = createLimiter(config.rateLimit.auth);
