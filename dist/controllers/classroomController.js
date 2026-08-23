"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishRound = exports.submitAnswer = exports.startRound = exports.joinClassroom = exports.createClassroom = void 0;
const classroomService_1 = require("../services/classroomService");
const asyncHandler_1 = require("../middleware/asyncHandler");
exports.createClassroom = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, school } = req.body;
    const classroom = await classroomService_1.ClassroomService.createClassroom(name, school, req.user.id);
    res.status(201).json({ success: true, data: classroom });
});
exports.joinClassroom = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { code } = req.body;
    const classroom = await classroomService_1.ClassroomService.getClassroomByCode(code);
    if (!classroom) {
        res.status(404).json({ success: false, message: "Classroom not found" });
        return;
    }
    const joined = await classroomService_1.ClassroomService.joinClassroom(classroom.id, req.user.id);
    res.status(200).json({ success: true, data: joined });
});
exports.startRound = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { classroomId } = req.params;
    const { questions } = req.body;
    const result = await classroomService_1.ClassroomService.startRound(classroomId, questions);
    res.status(201).json({ success: true, data: result });
});
exports.submitAnswer = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { roundId } = req.params;
    const { questionId, selectedIndex, correctIndex } = req.body;
    const result = await classroomService_1.ClassroomService.submitAnswer(roundId, req.user.id, questionId, selectedIndex, correctIndex);
    res.status(200).json({ success: true, data: result });
});
exports.finishRound = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { roundId } = req.params;
    const result = await classroomService_1.ClassroomService.finishRound(roundId);
    res.status(200).json({ success: true, data: result });
});
//# sourceMappingURL=classroomController.js.map