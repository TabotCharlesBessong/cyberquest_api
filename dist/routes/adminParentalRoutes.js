"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminParentalController_1 = require("../controllers/adminParentalController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/users/:userId/parental-controls", adminParentalController_1.getParentalControls);
router.put("/users/:userId/parental-controls", adminParentalController_1.upsertParentalControls);
exports.default = router;
//# sourceMappingURL=adminParentalRoutes.js.map