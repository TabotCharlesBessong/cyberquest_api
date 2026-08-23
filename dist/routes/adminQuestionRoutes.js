"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminCurriculumController_1 = require("../controllers/adminCurriculumController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/lessons/:lessonId/questions", adminCurriculumController_1.getQuestionsByLesson);
router.post("/questions", adminCurriculumController_1.createQuestion);
router.put("/questions/:id", adminCurriculumController_1.updateQuestion);
router.delete("/questions/:id", adminCurriculumController_1.deleteQuestion);
exports.default = router;
//# sourceMappingURL=adminQuestionRoutes.js.map