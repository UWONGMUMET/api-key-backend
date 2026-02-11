import crypto from "crypto";

export const generateApiKey = () => {
    crypto.randomBytes(32).toString("hex");
};

export const hashApiKey = (apiKey) => {
    crypto.createHash("sha256").update(apiKey).digest("hex");
}