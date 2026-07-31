import { Response } from "express";
import { User, ModuleProgress, LessonProgress, DailyActivity } from "../db";
import { AuthedRequest } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import { notFound } from "../utils/apiError";

export const getUsers = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
    const ageGroup = req.query.ageGroup as string | undefined;

    const where: any = {};
    if (ageGroup) where.ageGroup = ageGroup;

    const offset = (page - 1) * limit;

    const { rows: users, count } = await User.findAndCountAll({
      where,
      attributes: ["id", "name", "email", "age", "ageGroup", "avatar", "xp", "level", "streak", "hearts", "gems", "isVerified", "role", "createdAt"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const usersWithProgress = await Promise.all(
      users.map(async (user) => {
        const modules = await ModuleProgress.count({
          where: { userId: user.id },
        });
        const completedModules = await ModuleProgress.count({
          where: { userId: user.id, status: "completed" },
        });
        const lessonsCompleted = await LessonProgress.count({
          where: { userId: user.id, completed: true },
        });

        const recentActivity = await DailyActivity.findOne({
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
      })
    );

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
  }
);

export const getUserDetail = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "age", "ageGroup", "avatar", "xp", "level", "streak", "hearts", "gems", "isVerified", "role", "createdAt", "updatedAt"],
    });

    if (!user) throw notFound("User not found");

    const modules = await ModuleProgress.findAll({
      where: { userId: user.id },
      include: [
        { model: require("../db/models/Lecture").default, as: "lecture", attributes: ["id", "slug", "title", "subtitle", "icon", "color"] },
      ],
    });

    const lessons = await LessonProgress.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    const dailyActivities = await DailyActivity.findAll({
      where: { userId: user.id },
      order: [["date", "DESC"]],
      limit: 30,
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        modules: modules.map((m: any) => ({
          id: m.id,
          lectureId: m.lectureId,
          title: (m as any).lecture?.title,
          status: m.status,
          score: m.score,
          stars: m.stars,
          xpEarned: m.xpEarned,
          completedAt: m.completedAt,
        })),
        lessons: lessons.map((l: any) => ({
          id: l.id,
          lessonId: l.lessonId,
          attempts: l.attempts,
          correct: l.correct,
          bestScore: l.bestScore,
          completed: l.completed,
          lastResult: l.lastResult,
          createdAt: l.createdAt,
        })),
        dailyActivities: dailyActivities.map((a: any) => ({
          date: a.date,
          xpEarned: a.xpEarned,
          lessonsCompleted: a.lessonsCompleted,
          quizzesPassed: a.quizzesPassed,
          lastActionAt: a.lastActionAt,
        })),
      },
    });
  }
);

export const updateUser = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const user = await User.findByPk(id);
    if (!user) throw notFound("User not found");

    const allowed = ["name", "email", "age", "ageGroup", "avatar", "xp", "level", "streak", "hearts", "gems", "isVerified", "role"];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    await user.update(updates);
    res.status(200).json({ success: true, data: { user } });
  }
);

export const deleteUser = asyncHandler(
  async (req: AuthedRequest, res: Response) => {
    const id = typeof req.params.id === "string" ? req.params.id : "";
    const user = await User.findByPk(id);
    if (!user) throw notFound("User not found");

    await user.destroy();
    res.status(200).json({ success: true, data: { id } });
  }
);
