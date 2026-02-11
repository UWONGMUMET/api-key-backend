import { prisma } from "../config/prisma.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerService = async (email, password) => {
    const existing = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existing) {
        const error = new Error("User already exists");
        error.status = 409;
        throw error;
    }

    const hashed = await hashPassword(password);
    
    const user = await prisma.user.create({
        data: {
            email,
            password: hashed
        }
    });

    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
    };
};

export const loginService = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user || !(await comparePassword(password, user.password))) {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
        token
    };
};