import { paginate } from "../utils/pagination.js";
import { createKeyService, listKeyService, revokeKeyService} from "../services/key.service.js";

export const createKey = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            const error = new Error("Name is required");
            error.status = 400;
            throw error;
        }

        const key = await createKeyService(req.user.id, name);

        res.status(201).json({
            success: true,
            message: "API key created successfully",
            data: key
        });
    } catch (error) {
        next(error);
    }
};

export const listKey = async (req, res, next) => {
    try {
        const pagination = paginate(req.query);

        const keys = await listKeyService(req.user.id, pagination);

        res.status(200).json({
            success: true,
            message: "API keys retrieved successfully",
            data: keys
        });
    } catch (error) {
        next(error);
    }
};

export const revokeKey = async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        const key = await revokeKeyService(id, req.user.id);

        res.status(200).json({
            success: true,
            message: "API key revoked",
            data: key
        });
    } catch (error) {
        next(error);
    }
};