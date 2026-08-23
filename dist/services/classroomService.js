"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassroomService = void 0;
const db_1 = require("../db");
const apiError_1 = require("../utils/apiError");
const logger_1 = __importDefault(require("../utils/logger"));
class ClassroomService {
    static generateCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    static async createClassroom(name, school, teacherId) {
        const code = this.generateCode();
        const classroom = await db_1.Classroom.create({
            name,
            school,
            teacherId,
            code,
        });
        logger_1.default.info("Classroom created", { classroomId: classroom.id, code });
        return classroom;
    }
    static async getClassroomByCode(code) {
        const classroom = await db_1.Classroom.findOne({ where: { code: code.toUpperCase() } });
        if (!classroom)
            return null;
        return classroom;
    }
    static async joinClassroom(classroomId, userId) {
        const classroom = await db_1.Classroom.findByPk(classroomId);
        if (!classroom)
            throw (0, apiError_1.notFound)("Classroom not found");
        const members = classroom.memberIds || [];
        if (!members.includes(userId)) {
            members.push(userId);
            classroom.memberIds = members;
            await classroom.save();
        }
        logger_1.default.info("User joined classroom", { classroomId, userId });
        return classroom;
    }
    static async startRound(classroomId, questions) {
        const classroom = await db_1.Classroom.findByPk(classroomId);
        if (!classroom)
            throw (0, apiError_1.notFound)("Classroom not found");
        const round = await db_1.ClassroomRound.create({
            classroomId,
            status: "active",
            currentQuestionIndex: 0,
            startedAt: new Date(),
        });
        logger_1.default.info("Classroom round started", { roundId: round.id, classroomId });
        return { round, questions: questions.slice(0, 10) };
    }
    static async submitAnswer(roundId, userId, questionId, selectedIndex, correctIndex) {
        const round = await db_1.ClassroomRound.findByPk(roundId);
        if (!round || round.status !== "active") {
            throw (0, apiError_1.notFound)("Round not active");
        }
        const existing = await db_1.ClassroomParticipant.findOne({ where: { roundId, userId } });
        const currentScore = existing ? existing.score : 0;
        const score = selectedIndex === correctIndex ? 10 : 0;
        await db_1.ClassroomParticipant.upsert({
            roundId,
            userId,
            score: currentScore + score,
        });
        return { correct: selectedIndex === correctIndex, score };
    }
    static async finishRound(roundId) {
        const round = await db_1.ClassroomRound.findByPk(roundId);
        if (!round)
            throw (0, apiError_1.notFound)("Round not found");
        round.status = "finished";
        round.finishedAt = new Date();
        await round.save();
        const participants = await db_1.ClassroomParticipant.findAll({
            where: { roundId },
            include: [{ model: db_1.User, as: "user", attributes: ["id", "name", "avatar"] }],
            order: [["score", "DESC"]],
        });
        const results = participants.map((p, index) => {
            const user = p.user;
            return {
                userId: p.userId,
                name: user?.name || "Unknown",
                avatar: user?.avatar || "🦸",
                score: p.score,
                rank: index + 1,
            };
        });
        logger_1.default.info("Round finished", { roundId, participants: results.length });
        return { round, results };
    }
}
exports.ClassroomService = ClassroomService;
//# sourceMappingURL=classroomService.js.map