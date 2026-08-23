"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminCurriculumController_1 = require("../controllers/adminCurriculumController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/sections", adminCurriculumController_1.getAdminSections);
router.post("/sections", adminCurriculumController_1.createSection);
router.put("/sections/:id", adminCurriculumController_1.updateSection);
router.delete("/sections/:id", adminCurriculumController_1.deleteSection);
exports.default = router;
//# sourceMappingURL=adminCurriculumRoutes.js.map