"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.adminOnly = adminOnly;
const token_1 = require("../utils/token");
const apiError_1 = require("../utils/apiError");
function authMiddleware(req, _res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return next((0, apiError_1.unauthorized)("Authentication required"));
    }
    const token = header.split(" ")[1];
    try {
        const decoded = (0, token_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch {
        next((0, apiError_1.unauthorized)("Invalid or expired token"));
    }
}
function adminOnly(req, _res, next) {
    if (!req.user || req.user.role !== "admin") {
        return next((0, apiError_1.unauthorized)("Admin access required"));
    }
    next();
}
//# sourceMappingURL=auth.js.map