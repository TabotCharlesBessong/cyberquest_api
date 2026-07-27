import { Lecture, Lesson, LessonOption, LessonChoice, Concept, Standard, Question } from "../db";
import { AgeGroup } from "../db/models/Lesson";

export class LectureService {
  static async getAllLectures(ageGroup?: AgeGroup) {
    const lectures = await Lecture.findAll({
      include: [
        {
          model: Lesson,
          as: "lessons",
          order: [["order", "ASC"]],
          include: [
            { model: LessonOption, as: "options", order: [["position", "ASC"]] },
            { model: LessonChoice, as: "choices", order: [["position", "ASC"]] },
            { model: Concept, as: "concepts" },
            { model: Standard, as: "standards" },
            { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
          ],
        },
      ],
      order: [["order", "ASC"]],
    });

    return lectures.map(lecture => {
      const plain = lecture.get({ plain: true }) as Record<string, unknown>;
      let lessons = (lecture as any).lessons || [];

      if (ageGroup) {
        lessons = lessons.filter((l: any) => {
          const lg = l.ageGroup;
          return lg === ageGroup || lg === "ALL";
        });
      }

      return {
        ...plain,
        lessons: lessons.map((lesson: any) => {
          const lPlain = lesson.get({ plain: true }) as Record<string, unknown>;

          if (lesson.options?.length) {
            lPlain.options = lesson.options
              .sort((a: any, b: any) => a.position - b.position)
              .map((o: any) => o.text);
          }

          if (lesson.choices?.length) {
            lPlain.choices = lesson.choices
              .sort((a: any, b: any) => a.position - b.position)
              .map((c: any) => ({
                text: c.text,
                feedback: c.feedback,
                consequence: c.consequence,
                xpDelta: c.xpDelta,
              }));
          }

          if (lesson.questions?.length) {
            lPlain.questions = lesson.questions.map((q: any) => ({
              id: q.slug || q.id,
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
              difficulty: q.difficulty,
              xpReward: q.xpReward,
            }));
          }

          if (lesson.concepts?.length) {
            lPlain.conceptKeys = lesson.concepts.map((c: any) => c.code);
          }

          if (lesson.standards?.length) {
            lPlain.connexusStandards = lesson.standards.map((s: any) => s.code);
          }

          return lPlain;
        }),
      };
    });
  }

  static async getLectureBySlug(slug: string, ageGroup?: AgeGroup) {
    const lecture = await Lecture.findOne({
      where: { slug },
      include: [
        {
          model: Lesson,
          as: "lessons",
          order: [["order", "ASC"]],
          include: [
            { model: LessonOption, as: "options", order: [["position", "ASC"]] },
            { model: LessonChoice, as: "choices", order: [["position", "ASC"]] },
            { model: Concept, as: "concepts" },
            { model: Standard, as: "standards" },
            { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
          ],
        },
      ],
    });

    if (!lecture) return null;

    const plain = lecture.get({ plain: true }) as Record<string, unknown>;
    let lessons = (lecture as any).lessons || [];

    if (ageGroup) {
      lessons = lessons.filter((l: any) => {
        const lg = l.ageGroup;
        return lg === ageGroup || lg === "ALL";
      });
    }

    return {
      ...plain,
      lessons: lessons.map((lesson: any) => {
        const lPlain = lesson.get({ plain: true }) as Record<string, unknown>;

        if (lesson.options?.length) {
          lPlain.options = lesson.options
            .sort((a: any, b: any) => a.position - b.position)
            .map((o: any) => o.text);
        }

        if (lesson.choices?.length) {
          lPlain.choices = lesson.choices
            .sort((a: any, b: any) => a.position - b.position)
            .map((c: any) => ({
              text: c.text,
              feedback: c.feedback,
              consequence: c.consequence,
              xpDelta: c.xpDelta,
            }));
        }

        if (lesson.questions?.length) {
          lPlain.questions = lesson.questions.map((q: any) => ({
            id: q.slug || q.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            difficulty: q.difficulty,
            xpReward: q.xpReward,
          }));
        }

        if (lesson.concepts?.length) {
          lPlain.conceptKeys = lesson.concepts.map((c: any) => c.code);
        }

        if (lesson.standards?.length) {
          lPlain.connexusStandards = lesson.standards.map((s: any) => s.code);
        }

        return lPlain;
      }),
    };
  }
}
