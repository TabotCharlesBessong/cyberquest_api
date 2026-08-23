"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const db_1 = require("../db");
const Lesson_1 = require("../db/models/Lesson");
const Lecture_1 = require("../db/models/Lecture");
const Unit_1 = require("../db/models/Unit");
const User_1 = require("../db/models/User");
const sequelize_1 = require("sequelize");
const apiError_1 = require("../utils/apiError");
const logger_1 = __importDefault(require("../utils/logger"));
const debugTrace_1 = require("../utils/debugTrace");
const gamificationService_1 = require("./gamificationService");
const badgeService_1 = require("./badgeService");
const questService_1 = require("./questService");
const XP_PER_CORRECT = 10;
const XP_PER_WRONG = 5;
class ProgressService {
    static async submitLessonProgress(userId, lessonId, score, correctCount, total, userAgeGroup) {
        try {
            const lesson = await Lesson_1.Lesson.findByPk(lessonId);
            if (!lesson)
                throw (0, apiError_1.notFound)("Lesson not found");
            const lectureId = lesson.lectureId || (lesson.unitId ? (await Unit_1.Unit.findByPk(lesson.unitId))?.sectionId || null : null);
            if (!lectureId)
                throw (0, apiError_1.notFound)("Lecture not found");
            const lecture = await Lecture_1.Lecture.findByPk(lectureId);
            if (!lecture)
                throw (0, apiError_1.notFound)("Lecture not found");
            const effectiveTotal = total ?? 1;
            const effectiveCorrect = Math.max(0, Math.min(correctCount ?? Math.round(score / 100), effectiveTotal));
            const wrongCount = effectiveTotal - effectiveCorrect;
            const xpEarned = Math.max(0, effectiveCorrect * XP_PER_CORRECT - wrongCount * XP_PER_WRONG);
            (0, debugTrace_1.traceProgressFlow)("submit_start", {
                userId,
                lessonId,
                lectureId: lecture.id,
                lectureTitle: lecture.title,
                score,
                correctCount: effectiveCorrect,
                total: effectiveTotal,
                xpEarned,
            });
            logger_1.default.info("Lesson progress submitted", {
                component: "ProgressService",
                lessonId,
                lectureId: lecture.id,
                score,
                correctCount: effectiveCorrect,
                total: effectiveTotal,
                xpEarned,
            });
            const [lp] = await db_1.LessonProgress.findOrCreate({
                where: { userId, lessonId },
                defaults: {
                    userId,
                    lessonId,
                    attempts: 1,
                    correct: score >= 70 ? 1 : 0,
                    bestScore: score,
                    completed: score >= 70,
                    lastResult: score >= 70 ? "pass" : "fail",
                },
            });
            if (!lp.isNewRecord) {
                lp.attempts += 1;
                if (score >= 70) {
                    lp.correct += 1;
                }
                if (lp.bestScore === null || score > lp.bestScore) {
                    lp.bestScore = score;
                }
                if (score >= 70) {
                    lp.completed = true;
                    lp.lastResult = "pass";
                }
                await lp.save();
            }
            const [mp] = await db_1.ModuleProgress.findOrCreate({
                where: { userId, lectureId },
                defaults: {
                    userId,
                    lectureId,
                    status: "in_progress",
                    xpEarned: 0,
                    stars: 0,
                },
            });
            if (!mp.isNewRecord) {
                mp.xpEarned += xpEarned;
                if (score > (mp.score ?? 0)) {
                    mp.score = score;
                }
            }
            else {
                mp.xpEarned = xpEarned;
                mp.score = score;
            }
            const lessonQuery = { where: { lectureId } };
            if (userAgeGroup) {
                lessonQuery.where.ageGroup = userAgeGroup;
            }
            const allLessons = Number(await Lesson_1.Lesson.count(lessonQuery));
            const lessonIds = await Lesson_1.Lesson.findAll({
                where: { lectureId, ...(userAgeGroup ? { ageGroup: userAgeGroup } : {}) },
                attributes: ["id"],
            }).then(l => l.map(x => x.id));
            const completedCount = await db_1.LessonProgress.count({
                where: {
                    userId,
                    lessonId: { [sequelize_1.Op.in]: lessonIds },
                    completed: true,
                },
            });
            if (completedCount >= allLessons && allLessons > 0) {
                mp.status = "completed";
                mp.completedAt = new Date();
                if (mp.score === null)
                    mp.score = score;
                if (mp.score >= 90)
                    mp.stars = 3;
                else if (mp.score >= 70)
                    mp.stars = 2;
                else
                    mp.stars = 1;
                (0, debugTrace_1.traceProgressFlow)("module_completed", {
                    moduleId: mp.id,
                    lectureId: lecture.id,
                    lectureTitle: lecture.title,
                    completedLessons: completedCount,
                    totalLessons: allLessons,
                    status: mp.status,
                });
                logger_1.default.info("Module completed", {
                    component: "ProgressService",
                    moduleId: mp.id,
                    lectureId: lecture.id,
                    lectureTitle: lecture.title,
                    completedLessons: completedCount,
                    totalLessons: allLessons,
                });
            }
            else {
                mp.status = "in_progress";
                (0, debugTrace_1.traceProgressFlow)("module_in_progress", {
                    moduleId: mp.id,
                    lectureId: lecture.id,
                    lectureTitle: lecture.title,
                    completedLessons: completedCount,
                    totalLessons: allLessons,
                    status: mp.status,
                });
            }
            await mp.save();
            await User_1.User.increment("xp", { by: xpEarned, where: { id: userId } });
            const user = await User_1.User.findByPk(userId);
            if (user) {
                user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
                await user.save();
            }
            await gamificationService_1.GamificationService.recordDailyActivity(userId, new Date().toISOString().split("T")[0], xpEarned, score >= 70 ? 1 : 0, score >= 70 ? 1 : 0);
            await gamificationService_1.GamificationService.updateStreak(userId);
            await badgeService_1.BadgeService.checkAndAwardBadges(userId);
            await questService_1.QuestService.updateQuestProgress(userId, "complete_1_lesson");
            await questService_1.QuestService.updateQuestProgress(userId, "complete_3_lessons");
            await questService_1.QuestService.updateQuestProgress(userId, "win_2_quizzes");
            await questService_1.QuestService.updateQuestProgress(userId, "earn_50_xp");
            (0, debugTrace_1.traceProgressFlow)("submit_complete", {
                userId,
                moduleId: mp.id,
                lectureId: lecture.id,
                status: mp.status,
                xpEarned,
                newLevel: user?.level ?? 1,
            });
            return {
                lessonProgress: lp,
                moduleProgress: mp,
                xpEarned,
                newLevel: user?.level ?? 1,
            };
        }
        catch (error) {
            (0, debugTrace_1.traceProgressFlow)("submit_error", {
                userId,
                lessonId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            logger_1.default.error("Failed to submit lesson progress", {
                component: "ProgressService",
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }
    static async getUserProgress(userId) {
        try {
            const modules = await db_1.ModuleProgress.findAll({
                where: { userId },
                include: [
                    {
                        model: Lecture_1.Lecture,
                        as: "lecture",
                        attributes: ["id", "slug", "title", "subtitle", "icon", "color", "badge", "badgeName"],
                    },
                ],
            });
            const lessonProgress = await db_1.LessonProgress.findAll({
                where: { userId },
            });
            const user = await User_1.User.findByPk(userId);
            if (!user)
                throw (0, apiError_1.notFound)("User not found");
            const badges = await badgeService_1.BadgeService.getUserBadges(userId);
            logger_1.default.info("Fetched user progress", {
                component: "ProgressService",
                userId,
                moduleCount: modules.length,
                lessonProgressCount: lessonProgress.length,
            });
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    ageGroup: user.ageGroup,
                    avatar: user.avatar,
                    xp: user.xp,
                    level: user.level,
                    streak: user.streak,
                    hearts: user.hearts,
                    gems: user.gems,
                },
                badges,
                modules: modules.map(mp => ({
                    id: mp.id,
                    lectureId: mp.lectureId,
                    slug: mp.lecture?.slug,
                    title: mp.lecture?.title,
                    subtitle: mp.lecture?.subtitle,
                    icon: mp.lecture?.icon,
                    color: mp.lecture?.color,
                    badge: mp.lecture?.badge,
                    badgeName: mp.lecture?.badgeName,
                    status: mp.status,
                    score: mp.score,
                    stars: mp.stars,
                    xpEarned: mp.xpEarned,
                    completedAt: mp.completedAt,
                })),
                lessons: lessonProgress.map((lp) => ({
                    id: lp.id,
                    lessonId: lp.lessonId,
                    attempts: lp.attempts,
                    correct: lp.correct,
                    bestScore: lp.bestScore,
                    completed: lp.completed,
                    lastResult: lp.lastResult,
                })),
            };
        }
        catch (error) {
            logger_1.default.error("Failed to fetch user progress", {
                component: "ProgressService",
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }
}
exports.ProgressService = ProgressService;
//# sourceMappingURL=progressService.js.map