"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.forbidden = exports.unauthorized = exports.badRequest = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
const badRequest = (msg) => new ApiError(400, msg);
exports.badRequest = badRequest;
const unauthorized = (msg) => new ApiError(401, msg);
exports.unauthorized = unauthorized;
const forbidden = (msg) => new ApiError(403, msg);
exports.forbidden = forbidden;
const notFound = (msg) => new ApiError(404, msg);
exports.notFound = notFound;
//# sourceMappingURL=apiError.js.map