import { Lecture, Unit, Lesson, Question } from "../db";
import { CURRICULUM } from "../seeders/curriculumData";

export class CurriculumService {
  static async getSections(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { rows: sections, count } = await Lecture.findAndCountAll({
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
      limit,
      offset,
    });
    return { sections, total: count, page, limit, totalPages: Math.ceil(count / limit) };
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

  static async getUnits(sectionId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { rows: units, count } = await Unit.findAndCountAll({
      where: { sectionId },
      include: [
        {
          model: Lesson,
          as: "lessons",
          include: [{ model: Question, as: "questions" }],
        },
      ],
      order: [["order", "ASC"]],
      limit,
      offset,
    });
    return { units, total: count, page, limit, totalPages: Math.ceil(count / limit) };
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

  static async getLessons(unitId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { rows: lessons, count } = await Lesson.findAndCountAll({
      where: { unitId },
      include: [{ model: Question, as: "questions" }],
      order: [["order", "ASC"]],
      limit,
      offset,
    });
    return { lessons, total: count, page, limit, totalPages: Math.ceil(count / limit) };
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

  static async getQuestions(lessonId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { rows: questions, count } = await Question.findAndCountAll({
      where: { lessonId },
      order: [["difficulty", "ASC"]],
      limit,
      offset,
    });
    return { questions, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  static normalizeQuestion(data: Record<string, any>) {
    const type = data.type || "mcq";
    const normalized: Record<string, any> = { ...data, type };

    switch (type) {
      case "matching":
        normalized.options = null;
        normalized.correctIndex = null;
        normalized.sentenceParts = null;
        normalized.correctSentence = null;
        normalized.investigationSteps = null;
        normalized.correctOrder = null;
        if (!Array.isArray(normalized.pairs)) {
          throw new Error("Matching questions require 'pairs' array");
        }
        break;
      case "sentence_builder":
        normalized.options = null;
        normalized.correctIndex = null;
        normalized.pairs = null;
        normalized.investigationSteps = null;
        normalized.correctOrder = null;
        if (!Array.isArray(normalized.sentenceParts) || !normalized.correctSentence) {
          throw new Error("Sentence builder questions require 'sentenceParts' array and 'correctSentence'");
        }
        break;
      case "investigation":
        normalized.options = null;
        normalized.correctIndex = null;
        normalized.pairs = null;
        normalized.sentenceParts = null;
        normalized.correctSentence = null;
        if (!Array.isArray(normalized.investigationSteps) || !Array.isArray(normalized.correctOrder)) {
          throw new Error("Investigation questions require 'investigationSteps' and 'correctOrder' arrays");
        }
        break;
      case "mcq":
      default:
        normalized.pairs = null;
        normalized.sentenceParts = null;
        normalized.correctSentence = null;
        normalized.investigationSteps = null;
        normalized.correctOrder = null;
        if (!Array.isArray(normalized.options) || normalized.correctIndex == null) {
          throw new Error("MCQ questions require 'options' array and 'correctIndex'");
        }
        break;
    }

    return normalized;
  }

  static async createQuestion(data: any) {
    const normalized = this.normalizeQuestion(data);
    return Question.create(normalized as any);
  }

  static async updateQuestion(id: string, data: any) {
    const question = await Question.findByPk(id);
    if (!question) return null;
    const normalized = this.normalizeQuestion(data);
    return question.update(normalized as any);
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
