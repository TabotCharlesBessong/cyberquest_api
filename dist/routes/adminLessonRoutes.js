"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminCurriculumController_1 = require("../controllers/adminCurriculumController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/units/:unitId/lessons", adminCurriculumController_1.getLessonsByUnit);
router.post("/lessons", adminCurriculumController_1.createLesson);
router.put("/lessons/:id", adminCurriculumController_1.updateLesson);
router.delete("/lessons/:id", adminCurriculumController_1.deleteLesson);
exports.default = router;
//# sourceMappingURL=adminLessonRoutes.js.map