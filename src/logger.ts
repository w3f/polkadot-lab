import winston from 'winston';

import { Logger } from './types';

export function createLogger(level = 'info'): Logger {
    return winston.createLogger({
        level: level,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.errors({ stack: true }),
            winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
        ),
        transports: [
            new winston.transports.Console()
        ]
    });
}
