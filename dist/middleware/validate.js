"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
exports.validateParams = validateParams;
exports.validateQuery = validateQuery;
const zod_1 = require("zod");
const apiError_1 = require("../utils/apiError");
function validateBody(schema) {
    return (req, _res, next) => {
        try {
            req.body = schema.parse(req.body ?? {});
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return next((0, apiError_1.badRequest)(err.issues.map(i => i.message).join(", ")));
            }
            next(err);
        }
    };
}
function validateParams(schema) {
    return (req, _res, next) => {
        try {
            schema.parse(req.params);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return next((0, apiError_1.badRequest)(err.issues.map(i => i.message).join(", ")));
            }
            next(err);
        }
    };
}
function validateQuery(schema) {
    return (req, _res, next) => {
        try {
            schema.parse(req.query);
            next();
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return next((0, apiError_1.badRequest)(err.issues.map(i => i.message).join(", ")));
            }
            next(err);
        }
    };
}
//# sourceMappingURL=validate.js.map