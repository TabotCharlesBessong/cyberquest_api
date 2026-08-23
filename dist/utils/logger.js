"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
}));
const logger = winston_1.default.createLogger({
    level: logLevel,
    format,
    transports: [
        new winston_1.default.transports.Console({
            format,
        }),
    ],
});
exports.default = logger;
//# sourceMappingURL=logger.js.map