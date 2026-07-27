import { Lecture, Unit, Lesson, Question } from "../db";
import { CURRICULUM } from "../seeders/curriculumData";

export class CurriculumService {
  static async getSections() {
    return Lecture.findAll({
      include: [
        {
          model: Unit,
          as: "units",
          include: [
            {
              model: Lesson,
              as: "lessons",
              include: [{ model: Question, as: "questions" }],
            },
          ],
        },
      ],
      order: [["order", "ASC"]],
    });
  }

  static async getSectionBySlug(slug: string) {
    return Lecture.findOne({
      where: { slug },
      include: [
        {
          model: Unit,
          as: "units",
          include: [
            {
              model: Lesson,
              as: "lessons",
              include: [{ model: Question, as: "questions" }],
            },
          ],
        },
      ],
    });
  }

  static async createSection(data: any) {
    return Lecture.create(data);
  }

  static async updateSection(id: string, data: any) {
    const section = await Lecture.findByPk(id);
    if (!section) return null;
    return section.update(data);
  }

  static async deleteSection(id: string) {
    const section = await Lecture.findByPk(id);
    if (!section) return null;
    await section.destroy();
    return section;
  }

  static async getUnits(sectionId: string) {
    return Unit.findAll({
      where: { sectionId },
      include: [
        {
          model: Lesson,
          as: "lessons",
          include: [{ model: Question, as: "questions" }],
        },
      ],
      order: [["order", "ASC"]],
    });
  }

  static async createUnit(data: any) {
    return Unit.create(data);
  }

  static async updateUnit(id: string, data: any) {
    const unit = await Unit.findByPk(id);
    if (!unit) return null;
    return unit.update(data);
  }

  static async deleteUnit(id: string) {
    const unit = await Unit.findByPk(id);
    if (!unit) return null;
    await unit.destroy();
    return unit;
  }

  static async getLessons(unitId: string) {
    return Lesson.findAll({
      where: { unitId },
      include: [{ model: Question, as: "questions" }],
      order: [["order", "ASC"]],
    });
  }

  static async createLesson(data: any) {
    return Lesson.create(data);
  }

  static async updateLesson(id: string, data: any) {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) return null;
    return lesson.update(data);
  }

  static async deleteLesson(id: string) {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) return null;
    await lesson.destroy();
    return lesson;
  }

  static async getQuestions(lessonId: string) {
    return Question.findAll({
      where: { lessonId },
      order: [["difficulty", "ASC"]],
    });
  }

  static async createQuestion(data: any) {
    return Question.create(data);
  }

  static async updateQuestion(id: string, data: any) {
    const question = await Question.findByPk(id);
    if (!question) return null;
    return question.update(data);
  }

  static async deleteQuestion(id: string) {
    const question = await Question.findByPk(id);
    if (!question) return null;
    await question.destroy();
    return question;
  }

  static async importCurriculum(curriculum: any) {
    for (const section of curriculum.sections || []) {
      const [createdSection] = await Lecture.findOrCreate({
        where: { slug: section.id },
        defaults: section,
      });
      await createdSection.update(section);

      for (const unit of section.units || []) {
        const [createdUnit] = await Unit.findOrCreate({
          where: { slug: unit.id },
          defaults: { ...unit, sectionId: createdSection.id },
        });
        await createdUnit.update(unit);

        for (const lesson of unit.lessons || []) {
          const [createdLesson] = await Lesson.findOrCreate({
            where: { stepId: lesson.id },
            defaults: {
              ...lesson,
              unitId: createdUnit.id,
              lectureId: createdSection.id,
            },
          });
          await createdLesson.update(lesson);

          for (const q of lesson.questions || []) {
            const [question] = await Question.findOrCreate({
              where: { slug: q.id },
              defaults: { ...q, lessonId: createdLesson.id },
            });
            await question.update(q);
          }
        }
      }
    }
  }
}
