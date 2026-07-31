import {
  User,
  Lecture,
  Unit,
  Lesson,
  Question,
  ModuleProgress,
  LessonProgress,
  DailyActivity,
} from "../db";

export class AdminStatsService {
  static async getOverview() {
    const [
      totalUsers,
      totalSections,
      totalUnits,
      totalLessons,
      totalQuestions,
      completedLessons,
      totalProgress,
      verifiedUsers,
    ] = await Promise.all([
      User.count(),
      Lecture.count(),
      Unit.count(),
      Lesson.count(),
      Question.count(),
      LessonProgress.count({ where: { completed: true } }),
      ModuleProgress.count(),
      User.count({ where: { isVerified: true } }),
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
      completionRate:
        totalProgress > 0
          ? Math.round((completedLessons / totalProgress) * 100)
          : 0,
    };
  }

  static async getUserGrowth(days = 7) {
    const results: { date: string; count: number }[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.count({
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
    const results = await LessonProgress.findAll({
      attributes: [
        [
          require("sequelize").fn(
            "DATE",
            require("sequelize").col("createdAt"),
          ),
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

    return results.map((r: any) => ({
      date: r.get("date"),
      count: Number(r.get("count")),
    }));
  }

  static async getSectionPerformance() {
    const sections = await Lecture.findAll({
      attributes: ["id", "title", "color", "icon"],
      include: [
        {
          model: Unit,
          as: "units",
          attributes: ["id"],
          include: [
            {
              model: Lesson,
              as: "lessons",
              attributes: ["id"],
              include: [
                {
                  model: LessonProgress,
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

    return sections.map((section: any) => {
      const units = section.units || [];
      const lessons = units.flatMap((u: any) => u.lessons || []);
      const completedCount = lessons.reduce(
        (acc: number, l: any) => acc + (l.lessonProgresses?.length || 0),
        0,
      );
      const totalLessons = lessons.length;

      return {
        id: section.id,
        title: section.title,
        color: section.color,
        icon: section.icon,
        totalLessons,
        completedCount,
        completionRate:
          totalLessons > 0
            ? Math.round((completedCount / totalLessons) * 100)
            : 0,
      };
    });
  }

  static async getRecentActivity(limit = 10) {
    const recentUsers = await User.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      attributes: ["id", "name", "email", "createdAt", "isVerified"],
    });

    const recentProgress = await LessonProgress.findAll({
      order: [["createdAt", "DESC"]],
      limit,
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Lesson, as: "lesson", attributes: ["id", "title", "stepId"] },
      ],
    });

    return {
      recentUsers: recentUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
        isVerified: u.isVerified,
        type: "user_signup",
      })),
      recentProgress: recentProgress.map((p: any) => ({
        id: p.id,
        userId: p.user?.id,
        userName: p.user?.name,
        userEmail: p.user?.email,
        lessonId: p.lessonId,
        lessonTitle: (p.lesson as any)?.title,
        completed: p.completed,
        createdAt: p.createdAt,
        type: "lesson_completed",
      })),
    };
  }

  static async getUserActivityHeatmap(userId: string, days = 7) {
    const activities = await DailyActivity.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      limit: days,
    });

    return activities.map((a: any) => ({
      date: a.date,
      xpEarned: a.xpEarned,
      lessonsCompleted: a.lessonsCompleted,
      quizzesPassed: a.quizzesPassed,
      lastActionAt: a.lastActionAt,
    }));
  }
}
