"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const config_1 = __importDefault(require("../config/config"));
const logLevel = config_1.default.env === "production" ? "info" : "debug";
const transports = [
    new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
            const metaStr = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : "";
            return `${timestamp} [${level}]: ${message}${metaStr}`;
        })),
    }),
];
if (config_1.default.env === "production") {
    transports.push(new winston_1.default.transports.File({
        filename: "logs/error.log",
        level: "error",
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    }), new winston_1.default.transports.File({
        filename: "logs/combined.log",
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.json()),
    }));
}
const logger = winston_1.default.createLogger({
    level: logLevel,
    transports,
});
exports.default = logger;
//# sourceMappingURL=logger.js.map