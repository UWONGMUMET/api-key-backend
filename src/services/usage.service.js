import { prisma } from "../config/prisma.js";
import { config } from "../config/config.js";

const getCurrentMonth = () =>
    new Date().toISOString().slice(0, 7);

export const incrementUsageService = async (apiKey) => {

    const month = getCurrentMonth();

    const usage = await prisma.usage.upsert({
        where: {
            apiKeyId_month: {
                apiKeyId: apiKey.id,
                month
            }
        },
        update: {
            count: {
                increment: 1
            }
        },
        create: {
            apiKeyId: apiKey.id,
            month,
            count: 1
        }
    });

    const quota = config.quota[apiKey.user.plan];

    if (usage.count > quota) {
        const error = new Error("Quota exceeded");
        error.status = 403;
        throw error;
    }

    return usage;
};

export const getCurrentUsageService = async (userId) => {
    const month = getCurrentMonth();

    const usage = await prisma.usage.findMany({
        where: {
            month,
            apiKey: {
                userId
            }
        },

        include: {
            apiKey: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    return usage.map(u => ({
        id: u.apiKey.id,
        apiKeyName: u.apiKey.name,
        month: u.month,
        count: u.count
    }));
};

export const getUsageHistoryService = async (userId) => {
    const usage = await prisma.usage.findMany({
        where: {
            apiKey: {
                userId
            }
        },

        include: {
            apiKey: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: [
            {
                month: "desc"
            }
        ]
    });

    return usage.map(u => ({
        id: u.apiKey.id,
        apiKeyName: u.apiKey.name,
        month: u.month,
        count: u.count
    }));
}

export const getUsageSummaryService = async (userId) => {

    const month = new Date().toISOString().slice(0, 7);

    const keys = await prisma.apiKey.findMany({
        where: {
            userId,
            deletedAt: null
        },
        include: {
            user: true,
            usages: {
                where: { month }
            }
        }
    });

    return keys.map(key => {

        const usage = key.usages[0];
        const used = usage ? usage.count : 0;

        const plan = key.user?.plan;
        const quota = config.quota?.[plan] ?? 0;

        return {
            apiKeyId: key.id,
            name: key.name,
            used,
            quota
        };
    });
};