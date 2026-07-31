import { Op } from "sequelize";
import { sequelize } from "../db";
import { Classroom, ClassroomRound, ClassroomParticipant, User } from "../db";
import { notFound } from "../utils/apiError";
import logger from "../utils/logger";

export class ClassroomService {
  static generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  static async createClassroom(name: string, school: string, teacherId?: string) {
    const code = this.generateCode();
    const classroom = await Classroom.create({
      name,
      school,
      teacherId,
      code,
    });
    logger.info("Classroom created", { classroomId: (classroom as any).id, code });
    return classroom;
  }

  static async getClassroomByCode(code: string) {
    const classroom = await Classroom.findOne({ where: { code: code.toUpperCase() } });
    if (!classroom) return null;
    return classroom;
  }

  static async joinClassroom(classroomId: string, userId: string) {
    const classroom = await Classroom.findByPk(classroomId);
    if (!classroom) throw notFound("Classroom not found");

    const members = ((classroom as any).memberIds as string[]) || [];
    if (!members.includes(userId)) {
      members.push(userId);
      (classroom as any).memberIds = members;
      await classroom.save();
    }

    logger.info("User joined classroom", { classroomId, userId });
    return classroom;
  }

  static async startRound(classroomId: string, questions: { id: string; text: string; options: string[]; correctIndex: number }[]) {
    const classroom = await Classroom.findByPk(classroomId);
    if (!classroom) throw notFound("Classroom not found");

    const round = await ClassroomRound.create({
      classroomId,
      status: "active",
      currentQuestionIndex: 0,
      startedAt: new Date(),
    });

    logger.info("Classroom round started", { roundId: (round as any).id, classroomId });
    return { round, questions: questions.slice(0, 10) };
  }

  static async submitAnswer(roundId: string, userId: string, questionId: string, selectedIndex: number, correctIndex: number) {
    const round = await ClassroomRound.findByPk(roundId);
    if (!round || round.status !== "active") {
      throw notFound("Round not active");
    }

    const existing = await ClassroomParticipant.findOne({ where: { roundId, userId } });
    const currentScore = existing ? existing.score : 0;
    const score = selectedIndex === correctIndex ? 10 : 0;

    await ClassroomParticipant.upsert({
      roundId,
      userId,
      score: currentScore + score,
    });

    return { correct: selectedIndex === correctIndex, score };
  }

  static async finishRound(roundId: string) {
    const round = await ClassroomRound.findByPk(roundId);
    if (!round) throw notFound("Round not found");

    (round as any).status = "finished";
    (round as any).finishedAt = new Date();
    await round.save();

    const participants = await ClassroomParticipant.findAll({
      where: { roundId },
      include: [{ model: User, as: "user", attributes: ["id", "name", "avatar"] }],
      order: [["score", "DESC"]],
    });

    const results = participants.map((p: any, index: number) => {
      const user = p.user as { id: string; name: string; avatar: string } | null;
      return {
        userId: p.userId,
        name: user?.name || "Unknown",
        avatar: user?.avatar || "🦸",
        score: p.score,
        rank: index + 1,
      };
    });

    logger.info("Round finished", { roundId, participants: results.length });
    return { round, results };
  }
}
