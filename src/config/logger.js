import winston from 'winston';
import 'winston-daily-rotate-file';
import morgan from 'morgan';
import { config } from './config.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

const devFormat = printf(({ timestamp, level, message, stack}) => {
    return `${timestamp} ${level}: ${stack || message}`;
});

const transports = [
    new winston.transports.Console({
        format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), devFormat),
    }),
    new winston.transports.File({ filename: `${config.logger.dir}/app.log`, level: 'info' }),
    new winston.transports.File({ filename: `${config.logger.dir}/error.log`, level: 'error' })
];

export const logger = winston.createLogger({
    level: config.logger.level,
    format: combine(timestamp({ format: 'HH:mm:ss' }), errors({ stack: true }), devFormat),
    transports
})

export const morganMiddleware = morgan('combined', {
    stream: {
        write: (message) => logger.http(message.trim())
    }
});