import express from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import keyRoutes from "./routes/key.routes.js";

import { globalRateLimit } from "./middlewares/rateLimiter.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(globalRateLimit);
app.use(requestLogger);

app.use("/auth", authRoutes);
app.use("/keys", keyRoutes);

app.use(errorHandler);

app.get("/health-check", (req, res) => {
    res.send("API-KEY Backend is working!");
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
});