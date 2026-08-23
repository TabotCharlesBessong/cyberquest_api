"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminCurriculumController_1 = require("../controllers/adminCurriculumController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/sections/:sectionId/units", adminCurriculumController_1.getUnitsBySection);
router.post("/units", adminCurriculumController_1.createUnit);
router.put("/units/:id", adminCurriculumController_1.updateUnit);
router.delete("/units/:id", adminCurriculumController_1.deleteUnit);
exports.default = router;
//# sourceMappingURL=adminUnitRoutes.js.map