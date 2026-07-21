import { ModuleProgress, LessonProgress } from "../db";
import { Lesson } from "../db/models/Lesson";
import { Lecture } from "../db/models/Lecture";
import { User } from "../db/models/User";
import { Op } from "sequelize";
import { notFound } from "../utils/apiError";
import logger from "../utils/logger";

const XP_PER_CORRECT = 10;
const XP_PER_WRONG = 5;

export class ProgressService {
  static async submitLessonProgress(
    userId: string,
    lessonId: string,
    score: number,
    correctCount?: number,
    total?: number,
    userAgeGroup?: "A" | "B"
  ) {
    try {
      const lesson = await Lesson.findByPk(lessonId);
      if (!lesson) throw notFound("Lesson not found");

      const lecture = await Lecture.findByPk(lesson.lectureId);
      if (!lecture) throw notFound("Lecture not found");

      const effectiveTotal = total ?? 1;
      const effectiveCorrect = Math.max(0, Math.min(correctCount ?? Math.round(score / 100), effectiveTotal));
      const wrongCount = effectiveTotal - effectiveCorrect;
      const xpEarned = Math.max(0, effectiveCorrect * XP_PER_CORRECT - wrongCount * XP_PER_WRONG);

      logger.info("Lesson progress submitted", {
        component: "ProgressService",
        lessonId,
        lectureId: lecture.id,
        score,
        correctCount: effectiveCorrect,
        total: effectiveTotal,
        xpEarned,
      });

      const [lp] = await LessonProgress.findOrCreate({
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

      const [mp] = await ModuleProgress.findOrCreate({
        where: { userId, lectureId: lesson.lectureId },
        defaults: {
          userId,
          lectureId: lesson.lectureId,
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
      } else {
        mp.xpEarned = xpEarned;
        mp.score = score;
      }

      const lessonQuery: any = { where: { lectureId: lesson.lectureId } };
      if (userAgeGroup) {
        lessonQuery.where.ageGroup = userAgeGroup;
      }
      const allLessons = Number(await Lesson.count(lessonQuery as any));

      const lessonIds = await Lesson.findAll({
        where: { lectureId: lesson.lectureId, ...(userAgeGroup ? { ageGroup: userAgeGroup } : {}) },
        attributes: ["id"],
      }).then(l => l.map(x => x.id));

      const completedCount = await LessonProgress.count({
        where: {
          userId,
          lessonId: { [Op.in]: lessonIds },
          completed: true,
        },
      });

      if (completedCount >= allLessons && allLessons > 0) {
        mp.status = "completed";
        mp.completedAt = new Date();
        if (mp.score === null) mp.score = score;
        if (mp.score! >= 90) mp.stars = 3;
        else if (mp.score! >= 70) mp.stars = 2;
        else mp.stars = 1;

        logger.info("Module completed", {
          component: "ProgressService",
          moduleId: mp.id,
          lectureId: lecture.id,
          lectureTitle: lecture.title,
          completedLessons: completedCount,
          totalLessons: allLessons,
        });
      } else {
        mp.status = "in_progress";
      }

      await mp.save();

      await User.increment("xp", { by: xpEarned, where: { id: userId } });
      const user = await User.findByPk(userId);
      if (user) {
        user.level = Math.floor(Math.sqrt(user.xp / 100)) + 1;
        await user.save();
      }

      return {
        lessonProgress: lp,
        moduleProgress: mp,
        xpEarned,
        newLevel: user?.level ?? 1,
      };
    } catch (error) {
      logger.error("Failed to submit lesson progress", {
        component: "ProgressService",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  static async getUserProgress(userId: string) {
    try {
      const modules = await ModuleProgress.findAll({
        where: { userId },
        include: [
          {
            model: Lecture,
            as: "lecture",
            attributes: ["id", "slug", "title", "subtitle", "icon", "color", "badge", "badgeName"],
          },
        ],
      });

      const lessonProgress = await LessonProgress.findAll({
        where: { userId },
      });

      const user = await User.findByPk(userId);
      if (!user) throw notFound("User not found");

      logger.info("Fetched user progress", {
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
        modules: modules.map(mp => ({
          id: mp.id,
          lectureId: mp.lectureId,
          slug: (mp as any).lecture?.slug,
          title: (mp as any).lecture?.title,
          subtitle: (mp as any).lecture?.subtitle,
          icon: (mp as any).lecture?.icon,
          color: (mp as any).lecture?.color,
          badge: (mp as any).lecture?.badge,
          badgeName: (mp as any).lecture?.badgeName,
          status: mp.status,
          score: mp.score,
          stars: mp.stars,
          xpEarned: mp.xpEarned,
          completedAt: mp.completedAt,
        })),
        lessons: lessonProgress.map((lp: LessonProgress) => ({
          id: lp.id,
          lessonId: lp.lessonId,
          attempts: lp.attempts,
          correct: lp.correct,
          bestScore: lp.bestScore,
          completed: lp.completed,
          lastResult: lp.lastResult,
        })),
      };
    } catch (error) {
      logger.error("Failed to fetch user progress", {
        component: "ProgressService",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
