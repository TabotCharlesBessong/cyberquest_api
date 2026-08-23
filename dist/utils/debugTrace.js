"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traceUnlockFlow = traceUnlockFlow;
exports.traceProgressFlow = traceProgressFlow;
const winston_1 = __importDefault(require("winston"));
const isDebug = process.env.CYBERQUEST_DEBUG === 'true';
const format = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
}));
const logger = winston_1.default.createLogger({
    level: 'debug',
    format,
    transports: [
        new winston_1.default.transports.Console({
            format,
        }),
    ],
});
function traceUnlockFlow(step, data) {
    if (!isDebug)
        return;
    logger.debug(`[UnlockTrace] ${step}`, data);
}
function traceProgressFlow(step, data) {
    if (!isDebug)
        return;
    logger.debug(`[ProgressTrace] ${step}`, data);
}
exports.default = logger;
//# sourceMappingURL=debugTrace.js.map