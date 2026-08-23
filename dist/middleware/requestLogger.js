"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
const logger_1 = __importDefault(require("../utils/logger"));
function requestLogger(req, res, next) {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.headers["user-agent"],
            ip: req.ip || req.connection.remoteAddress,
        };
        if (res.statusCode >= 500) {
            logger_1.default.error("HTTP request error", logData);
        }
        else if (res.statusCode >= 400) {
            logger_1.default.warn("HTTP request warning", logData);
        }
        else {
            logger_1.default.info("HTTP request", logData);
        }
    });
    next();
}
//# sourceMappingURL=requestLogger.js.map