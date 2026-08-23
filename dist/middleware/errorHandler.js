"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const apiError_1 = require("../utils/apiError");
const logger_1 = __importDefault(require("../utils/logger"));
function notFoundHandler(_req, res) {
    res.status(404).json({ success: false, message: "Route not found" });
}
function errorHandler(err, _req, res, _next) {
    if (err instanceof apiError_1.ApiError) {
        logger_1.default.warn(`API Error: ${err.message}`, {
            component: "errorHandler",
            statusCode: err.statusCode,
        });
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    logger_1.default.error("Internal server error", {
        component: "errorHandler",
        error: err.message,
        stack: err.stack,
    });
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
//# sourceMappingURL=errorHandler.js.map