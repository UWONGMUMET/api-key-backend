import { getCurrentUsageService, getUsageHistoryService, getUsageSummaryService } from "../services/usage.service.js";

export const currentUsageController = async (req, res, next) => {
    try {
        const usage = await getCurrentUsageService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Current usage retrieved successfully",
            data: usage
        });
    } catch (error) {
        next(error);
    }
};

export const historyUsageController = async (req, res, next) => {
    try {
        const usage = await getUsageHistoryService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Usage history retrieved successfully",
            data: usage
        });

    } catch (error) {
        next(error);
    }
};

export const summaryUsageController = async (req, res, next) => {
    try {
        const summary = await getUsageSummaryService(req.params.id);

        res.status(200).json({
            success: true,
            message: "Usage summary retrieved successfully",
            data: summary
        });
    } catch (error) {
        next(error);
    }
}