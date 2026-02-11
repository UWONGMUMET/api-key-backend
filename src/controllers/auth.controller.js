import * as service from "../services/auth.service.js"

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.status = 400;
            throw error;
        }

        const user = await service.registerService(email, password);
        
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.status = 400;
            throw error;
        }

        const result = await service.loginService(email, password);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next(error);
    }
};