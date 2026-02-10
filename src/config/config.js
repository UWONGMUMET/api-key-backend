import "dotenv/config";

export const config = {
    port: process.env.PORT,
    env: process.env.NODE_ENV,

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN
    },

    quota: {
        FREE: Number(process.env.QUOTA_FREE),
        PAID: Number(process.env.QUOTA_PAID)
    },

    rateLimit: {
        global: {
            windowMs: Number(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS),
            max: Number(process.env.GLOBAL_RATE_LIMIT_MAX)
        },
        auth: {
            windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS),
            max: Number(process.env.AUTH_RATE_LIMIT_MAX)
        }
    },

    bcryptSalt: Number(process.env.BCRYPT_SALT),

    logger: {
        level: process.env.LOG_LEVEL,
        dir: process.env.LOG_DIR
    }
}