import { prisma } from "../config/prisma.js";
import { generateApiKey, hashApiKey } from "../utils/hashkey.js";

export const createKeyService = async (userId, name) => {
    const rawKey = generateApiKey();
    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.create({
        data: {
            name,
            keyHash,
            userId,
            isActive: true
        }
    });

    return {
        id: apiKey.id,
        name: apiKey.name,
        key: rawKey,
        createdAt: apiKey.createdAt
    }
};

export const listKeyService = async (userId, pagination) => {
    const keys = await prisma.apiKey.findMany({
        where: {
            userId,
            deletedAt: null
        },
        orderBy: {
            createdAt: "desc"
        },
        ...pagination
    });

    return keys.map((key) => ({
        id: key.id,
        name: key.name,
        isActive: key.isActive,
        createdAt: key.createdAt,
        revokedAt: key.deletedAt
    }));
};

export const revokeKeyService = async (id, userId) => {
    const key = await prisma.apiKey.findFirst({
        where: {
            id,
            userId,
            deletedAt: null
        }
    });

    if (!key) {
        const error = new Error("API key not found");
        error.status = 404;
        throw error;
    }

    const revoked = await prisma.apiKey.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date(),
            isActive: false
        }
    });

    return {
        id: revoked.id,
        isActive: revoked.isActive
    }
};