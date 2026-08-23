"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminStatsService = void 0;
const db_1 = require("../db");
class AdminStatsService {
    static async getOverview() {
        const [totalUsers, totalSections, totalUnits, totalLessons, totalQuestions, completedLessons, totalProgress, verifiedUsers,] = await Promise.all([
            db_1.User.count(),
            db_1.Lecture.count(),
            db_1.Unit.count(),
            db_1.Lesson.count(),
            db_1.Question.count(),
            db_1.LessonProgress.count({ where: { completed: true } }),
            db_1.ModuleProgress.count(),
            db_1.User.count({ where: { isVerified: true } }),
        ]);
        return {
            totalUsers,
            verifiedUsers,
            unverifiedUsers: totalUsers - verifiedUsers,
            totalSections,
            totalUnits,
            totalLessons,
            totalQuestions,
            completedLessons,
            totalProgress,
            completionRate: totalProgress > 0
                ? Math.round((completedLessons / totalProgress) * 100)
                : 0,
        };
    }
    static async getUserGrowth(days = 7) {
        const results = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const count = await db_1.User.count({
                where: {
                    createdAt: {
                        [require("sequelize").Op.gte]: date,
                        [require("sequelize").Op.lt]: nextDate,
                    },
                },
            });
            results.push({
                date: date.toISOString().split("T")[0],
                count,
            });
        }
        return results;
    }
    static async getLessonCompletionStats() {
        const results = await db_1.LessonProgress.findAll({
            attributes: [
                [
                    require("sequelize").fn("DATE", require("sequelize").col("createdAt")),
                    "date",
                ],
                [
                    require("sequelize").fn("COUNT", require("sequelize").col("id")),
                    "count",
                ],
            ],
            where: { completed: true },
            group: [
                require("sequelize").fn("DATE", require("sequelize").col("createdAt")),
            ],
            order: [
                require("sequelize").fn("DATE", require("sequelize").col("createdAt")),
                "ASC",
            ],
            limit: 7,
        });
        return results.map((r) => ({
            date: r.get("date"),
            count: Number(r.get("count")),
        }));
    }
    static async getSectionPerformance() {
        const sections = await db_1.Lecture.findAll({
            attributes: ["id", "title", "color", "icon"],
            include: [
                {
                    model: db_1.Unit,
                    as: "units",
                    attributes: ["id"],
                    include: [
                        {
                            model: db_1.Lesson,
                            as: "lessons",
                            attributes: ["id"],
                            include: [
                                {
                                    model: db_1.LessonProgress,
                                    as: "lessonProgresses",
                                    attributes: ["id"],
                                    where: { completed: true },
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        return sections.map((section) => {
            const units = section.units || [];
            const lessons = units.flatMap((u) => u.lessons || []);
            const completedCount = lessons.reduce((acc, l) => acc + (l.lessonProgresses?.length || 0), 0);
            const totalLessons = lessons.length;
            return {
                id: section.id,
                title: section.title,
                color: section.color,
                icon: section.icon,
                totalLessons,
                completedCount,
                completionRate: totalLessons > 0
                    ? Math.round((completedCount / totalLessons) * 100)
                    : 0,
            };
        });
    }
    static async getRecentActivity(limit = 10) {
        const recentUsers = await db_1.User.findAll({
            order: [["createdAt", "DESC"]],
            limit,
            attributes: ["id", "name", "email", "createdAt", "isVerified"],
        });
        const recentProgress = await db_1.LessonProgress.findAll({
            order: [["createdAt", "DESC"]],
            limit,
            include: [
                { model: db_1.User, as: "user", attributes: ["id", "name", "email"] },
                { model: db_1.Lesson, as: "lesson", attributes: ["id", "title", "stepId"] },
            ],
        });
        return {
            recentUsers: recentUsers.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt,
                isVerified: u.isVerified,
                type: "user_signup",
            })),
            recentProgress: recentProgress.map((p) => ({
                id: p.id,
                userId: p.user?.id,
                userName: p.user?.name,
                userEmail: p.user?.email,
                lessonId: p.lessonId,
                lessonTitle: p.lesson?.title,
                completed: p.completed,
                createdAt: p.createdAt,
                type: "lesson_completed",
            })),
        };
    }
    static async getUserActivityHeatmap(userId, days = 7) {
        const activities = await db_1.DailyActivity.findAll({
            where: { userId },
            order: [["date", "DESC"]],
            limit: days,
        });
        return activities.map((a) => ({
            date: a.date,
            xpEarned: a.xpEarned,
            lessonsCompleted: a.lessonsCompleted,
            quizzesPassed: a.quizzesPassed,
            lastActionAt: a.lastActionAt,
        }));
    }
}
exports.AdminStatsService = AdminStatsService;
//# sourceMappingURL=adminStatsService.js.map