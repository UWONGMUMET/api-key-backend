import { logger } from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip
    });

    res.status(status).json({
        success: false,
        message: status === 500 ? "Internal Server Error" : err.message
    });
};
