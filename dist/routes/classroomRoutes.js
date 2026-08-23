"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const classroomController_1 = require("../controllers/classroomController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authMiddleware);
router.post("/", classroomController_1.createClassroom);
router.post("/join", classroomController_1.joinClassroom);
router.post("/:classroomId/round/start", classroomController_1.startRound);
router.post("/rounds/:roundId/answer", classroomController_1.submitAnswer);
router.post("/rounds/:roundId/finish", classroomController_1.finishRound);
exports.default = router;
//# sourceMappingURL=classroomRoutes.js.map