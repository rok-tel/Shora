"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
// Create a logger instance
exports.logger = (0, winston_1.createLogger)({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
    defaultMeta: { service: 'shora-worker' },
    transports: [
        // Write to console
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.printf(({ level, message, timestamp, ...metadata }) => {
                let msg = `${timestamp} [${level}]: ${message}`;
                if (Object.keys(metadata).length > 0 && metadata.service) {
                    msg += JSON.stringify(metadata);
                }
                return msg;
            }))
        }),
        // Write to file
        new winston_1.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston_1.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});
// If we're not in production, also log to the console with simpler formatting
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.transports.Console({
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple())
    }));
}
