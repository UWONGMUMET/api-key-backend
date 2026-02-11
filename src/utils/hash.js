import bcrypt from "bcrypt";
import { config } from "../config/config.js";

export const hashPassword = async (password) => {
    return bcrypt.hash(password, config.bcryptSalt);
};

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};