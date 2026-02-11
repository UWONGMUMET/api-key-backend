import { prisma } from "../config/prisma.js";
import { hashApiKey } from "../utils/hashkey.js";
import { config } from "../config/config.js";

export const apiKeyMiddleware = async (req, res, next) => {
    const rawKey = req.headers["x-api-key"];
    if (!rawKey) {
        const error = new Error("API key is missing");
        error.status = 401;
        throw error;
    }

    const apiKey = await prisma.apiKey.findFirst({
        where: {
            keyHash: hashApiKey(rawKey),
            isActive: true,
            deletedAt: null
        },
        include: {
            user: true
        }
    });

    if (!apiKey) {
        const error = new Error("Invalid API key");
        error.status = 401;
        throw error;
    }

    const month = new Date().toISOString().slice(0, 7);
    const quota = config.quota[apiKey.user.plan];

    const usage = await prisma.usage.upsert({
        where: {
            apiKeyId_month: {
                apiKeyId: apiKey.id,
                month
            },
        },
        update: {},
        create: {
            apiKeyId: apiKey.id,
            month
        }
    });

    if (usage.count >= quota) {
        const error = new Error("Quota exceeded");
        error.status = 403;
        throw error;
    }

    req.apiKey = apiKey;
    req.usage = usage;
    next();
}