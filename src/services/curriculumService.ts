import { Lecture, Lesson, Unit, Question } from "../db";
import { AgeGroup } from "../db/models/Lesson";

export class CurriculumService {
  static async getSections(ageGroup?: AgeGroup) {
    const sections = await Lecture.findAll({
      include: [
        {
          model: Unit,
          as: "units",
          order: [["order", "ASC"]],
          include: [
            {
              model: Lesson,
              as: "lessons",
              order: [["order", "ASC"]],
              include: [
                { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
              ],
            },
          ],
        },
      ],
      order: [["order", "ASC"]],
    });

    return sections.map(section => {
      const plain = section.get({ plain: true }) as Record<string, unknown>;
      let units = (section as any).units || [];

      if (ageGroup) {
        units = units.filter((u: any) => u.ageGroup === ageGroup || u.ageGroup === "ALL");
      }

      if (units.length === 0) {
        return null;
      }

      return {
        ...plain,
        units: units.map((unit: any) => {
          const uPlain = unit.get({ plain: true }) as Record<string, unknown>;
          let lessons = (unit as any).lessons || [];

          if (ageGroup) {
            lessons = lessons.filter((l: any) => l.ageGroup === ageGroup || l.ageGroup === "ALL");
          }

          return {
            ...uPlain,
            lessons: lessons.map((lesson: any) => {
              const lPlain = lesson.get({ plain: true }) as Record<string, unknown>;

              if (lesson.questions?.length) {
                lPlain.questions = lesson.questions.map((q: any) => ({
                  id: q.slug || q.id,
                  type: q.type || "mcq",
                  question: q.question,
                  options: q.options,
                  correctIndex: q.correctIndex,
                  pairs: q.pairs,
                  sentenceParts: q.sentenceParts,
                  correctSentence: q.correctSentence,
                  investigationSteps: q.investigationSteps,
                  correctOrder: q.correctOrder,
                  explanation: q.explanation,
                  difficulty: q.difficulty,
                  xpReward: q.xpReward,
                }));
              }

              if (lesson.missionBriefing) {
                lPlain.missionBriefing = lesson.missionBriefing;
              }

              return lPlain;
            }),
          };
        }),
      };
    }).filter((s: any) => s !== null);
  }

  static async getSectionBySlug(slug: string, ageGroup?: AgeGroup) {
    const section = await Lecture.findOne({
      where: { slug },
      include: [
        {
          model: Unit,
          as: "units",
          order: [["order", "ASC"]],
          include: [
            {
              model: Lesson,
              as: "lessons",
              order: [["order", "ASC"]],
              include: [
                { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
              ],
            },
          ],
        },
      ],
    });

    if (!section) return null;

    const plain = section.get({ plain: true }) as Record<string, unknown>;
    let units = (section as any).units || [];

    if (ageGroup) {
      units = units.filter((u: any) => u.ageGroup === ageGroup || u.ageGroup === "ALL");
    }

    if (units.length === 0) {
      return null;
    }

    return {
      ...plain,
      units: units.map((unit: any) => {
        const uPlain = unit.get({ plain: true }) as Record<string, unknown>;
        let lessons = (unit as any).lessons || [];

        if (ageGroup) {
          lessons = lessons.filter((l: any) => l.ageGroup === ageGroup || l.ageGroup === "ALL");
        }

        return {
          ...uPlain,
          lessons: lessons.map((lesson: any) => {
            const lPlain = lesson.get({ plain: true }) as Record<string, unknown>;

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

            return lPlain;
          }),
        };
      }),
    };
  }

  static async getUnits(sectionId: string) {
    return Unit.findAll({
      where: { sectionId },
      include: [
        {
          model: Lesson,
          as: "lessons",
          order: [["order", "ASC"]],
          include: [
            { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
          ],
        },
      ],
      order: [["order", "ASC"]],
    });
  }

  static async getUnitById(id: string) {
    return Unit.findOne({
      where: { id },
      include: [
        {
          model: Lesson,
          as: "lessons",
          order: [["order", "ASC"]],
          include: [
            { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
          ],
        },
      ],
    });
  }

  static async getLessons(unitId: string) {
    return Lesson.findAll({
      where: { unitId },
      include: [
        { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
      ],
      order: [["order", "ASC"]],
    });
  }

  static async getLessonById(id: string) {
    return Lesson.findOne({
      where: { id },
      include: [
        { model: Question, as: "questions", order: [["difficulty", "ASC"]] },
      ],
    });
  }
}
