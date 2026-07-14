import "dotenv/config";
import { sequelize, Lecture, Lesson } from "../db";
import { SEED_LECTURES } from "./data";

async function seed(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("[seed] Connected to PostgreSQL");

    // Ensure the tables exist (so the seed works even if the server
    // hasn't run / synced yet).
    await sequelize.sync({ alter: true });
    console.log("[seed] Models synchronized");

    // Reset existing lecture data (order matters for FK)
    await Lesson.destroy({ where: {}, truncate: true, cascade: true });
    await Lecture.destroy({ where: {}, truncate: true, cascade: true });

    for (const lecture of SEED_LECTURES) {
      const created = await Lecture.create({
        slug: lecture.slug,
        title: lecture.title,
        subtitle: lecture.subtitle,
        icon: lecture.icon,
        color: lecture.color,
        badge: lecture.badge,
        badgeName: lecture.badgeName,
        order: lecture.order,
      });

      await Lesson.bulkCreate(
        lecture.lessons.map((lesson, index) => ({
          lectureId: created.id,
          stepId: lesson.stepId,
          type: lesson.type,
          title: lesson.title ?? "",
          text: lesson.text ?? null,
          question: lesson.question ?? null,
          options: lesson.options ?? null,
          answer: lesson.answer ?? null,
          explanation: lesson.explanation ?? null,
          icon: lesson.icon ?? null,
          mascot: lesson.mascot ?? null,
          speech: lesson.speech ?? null,
          order: index + 1,
        }))
      );

      console.log(`[seed] Seeded lecture: ${lecture.title}`);
    }

    console.log("[seed] Done 🎉");
  } catch (err) {
    console.error("[seed] Failed:", err);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

void seed();
