"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.get("/active", eventController_1.getActiveEvent);
router.get("/", eventController_1.listEvents);
exports.default = router;
//# sourceMappingURL=eventRoutes.js.map