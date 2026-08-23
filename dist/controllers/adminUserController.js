"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserDetail = exports.getUsers = void 0;
const db_1 = require("../db");
const asyncHandler_1 = require("../middleware/asyncHandler");
const apiError_1 = require("../utils/apiError");
exports.getUsers = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    const ageGroup = req.query.ageGroup;
    const where = {};
    if (ageGroup)
        where.ageGroup = ageGroup;
    const offset = (page - 1) * limit;
    const { rows: users, count } = await db_1.User.findAndCountAll({
        where,
        attributes: ["id", "name", "email", "age", "ageGroup", "avatar", "xp", "level", "streak", "hearts", "gems", "isVerified", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
    });
    const usersWithProgress = await Promise.all(users.map(async (user) => {
        const modules = await db_1.ModuleProgress.count({
            where: { userId: user.id },
        });
        const completedModules = await db_1.ModuleProgress.count({
            where: { userId: user.id, status: "completed" },
        });
        const lessonsCompleted = await db_1.LessonProgress.count({
            where: { userId: user.id, completed: true },
        });
        const recentActivity = await db_1.DailyActivity.findOne({
            where: { userId: user.id },
            order: [["date", "DESC"]],
        });
        return {
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
            isVerified: user.isVerified,
            role: user.role,
            createdAt: user.createdAt,
            stats: {
                totalModules: modules,
                completedModules,
                lessonsCompleted,
                lastActive: recentActivity?.lastActionAt || recentActivity?.createdAt || null,
            },
        };
    }));
    res.status(200).json({
        success: true,
        data: {
            users: usersWithProgress,
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    });
});
exports.getUserDetail = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const user = await db_1.User.findByPk(id, {
        attributes: ["id", "name", "email", "age", "ageGroup", "avatar", "xp", "level", "streak", "hearts", "gems", "isVerified", "role", "createdAt", "updatedAt"],
    });
    if (!user)
        throw (0, apiError_1.notFound)("User not found");
    const modules = await db_1.ModuleProgress.findAll({
        where: { userId: user.id },
        include: [
            { model: require("../db/models/Lecture").default, as: "lecture", attributes: ["id", "slug", "title", "subtitle", "icon", "color"] },
        ],
    });
    const lessons = await db_1.LessonProgress.findAll({
        where: { userId: user.id },
        order: [["createdAt", "DESC"]],
        limit: 50,
    });
    const dailyActivities = await db_1.DailyActivity.findAll({
        where: { userId: user.id },
        order: [["date", "DESC"]],
        limit: 30,
    });
    res.status(200).json({
        success: true,
        data: {
            user,
            modules: modules.map((m) => ({
                id: m.id,
                lectureId: m.lectureId,
                title: m.lecture?.title,
                status: m.status,
                score: m.score,
                stars: m.stars,
                xpEarned: m.xpEarned,
                completedAt: m.completedAt,
            })),
            lessons: lessons.map((l) => ({
                id: l.id,
                lessonId: l.lessonId,
                attempts: l.attempts,
                correct: l.correct,
                bestScore: l.bestScore,
                completed: l.completed,
                lastResult: l.lastResult,
                createdAt: l.createdAt,
            })),
            dailyActivities: dailyActivities.map((a) => ({
                date: a.date,
                xpEarned: a.xpEarned,
                lessonsCompleted: a.lessonsCompleted,
                quizzesPassed: a.quizzesPassed,
                lastActionAt: a.lastActionAt,
            })),
        },
    });
});
exports.updateUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const user = await db_1.User.findByPk(id);
    if (!user)
        throw (0, apiError_1.notFound)("User not found");
    const allowed = ["name", "email", "age", "ageGroup", "avatar", "xp", "level", "streak", "hearts", "gems", "isVerified", "role"];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined)
            updates[key] = req.body[key];
    }
    await user.update(updates);
    res.status(200).json({ success: true, data: { user } });
});
exports.deleteUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const user = await db_1.User.findByPk(id);
    if (!user)
        throw (0, apiError_1.notFound)("User not found");
    await user.destroy();
    res.status(200).json({ success: true, data: { id } });
});
//# sourceMappingURL=adminUserController.js.map