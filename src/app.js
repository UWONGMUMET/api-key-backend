import express from "express";
import cors from "cors";
import helmet from "helmet";

import { prisma } from "./config/prisma.js";
import { config } from "./config/config.js";
import authRoutes from "./routes/auth.routes.js";
import keyRoutes from "./routes/key.routes.js";
import usageRoutes from "./routes/usage.routes.js";

import { apiKeyMiddleware } from "./middlewares/apiKey.middleware.js";
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
app.use("/usage", usageRoutes);

app.use(errorHandler);

app.get("/health-check", (req, res) => {
    res.send("API-KEY Backend is working!");
});

app.get("/protected/test", apiKeyMiddleware, async (req, res) => {
  await prisma.usage.update({
    where: {
      id: req.usage.id
    },
    data: {
      count: {
        increment: 1
      }
    }
  });

  res.json({
    success: true,
    message: "Protected route hit",
  });
});

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
});