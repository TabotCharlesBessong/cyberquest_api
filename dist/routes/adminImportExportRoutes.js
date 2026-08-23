"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminCurriculumController_1 = require("../controllers/adminCurriculumController");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware, auth_1.adminOnly);
router.get("/export", adminCurriculumController_1.exportCurriculum);
router.post("/import", adminCurriculumController_1.importCurriculum);
exports.default = router;
//# sourceMappingURL=adminImportExportRoutes.js.map