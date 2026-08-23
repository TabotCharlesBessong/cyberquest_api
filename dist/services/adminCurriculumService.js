"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumService = void 0;
const db_1 = require("../db");
class CurriculumService {
    static async getSections(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const { rows: sections, count } = await db_1.Lecture.findAndCountAll({
            include: [
                {
                    model: db_1.Unit,
                    as: "units",
                    include: [
                        {
                            model: db_1.Lesson,
                            as: "lessons",
                            include: [{ model: db_1.Question, as: "questions" }],
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
    static async getSectionBySlug(slug) {
        return db_1.Lecture.findOne({
            where: { slug },
            include: [
                {
                    model: db_1.Unit,
                    as: "units",
                    include: [
                        {
                            model: db_1.Lesson,
                            as: "lessons",
                            include: [{ model: db_1.Question, as: "questions" }],
                        },
                    ],
                },
            ],
        });
    }
    static async createSection(data) {
        return db_1.Lecture.create(data);
    }
    static async updateSection(id, data) {
        const section = await db_1.Lecture.findByPk(id);
        if (!section)
            return null;
        return section.update(data);
    }
    static async deleteSection(id) {
        const section = await db_1.Lecture.findByPk(id);
        if (!section)
            return null;
        await section.destroy();
        return section;
    }
    static async getUnits(sectionId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const { rows: units, count } = await db_1.Unit.findAndCountAll({
            where: { sectionId },
            include: [
                {
                    model: db_1.Lesson,
                    as: "lessons",
                    include: [{ model: db_1.Question, as: "questions" }],
                },
            ],
            order: [["order", "ASC"]],
            limit,
            offset,
        });
        return { units, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }
    static async createUnit(data) {
        return db_1.Unit.create(data);
    }
    static async updateUnit(id, data) {
        const unit = await db_1.Unit.findByPk(id);
        if (!unit)
            return null;
        return unit.update(data);
    }
    static async deleteUnit(id) {
        const unit = await db_1.Unit.findByPk(id);
        if (!unit)
            return null;
        await unit.destroy();
        return unit;
    }
    static async getLessons(unitId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const { rows: lessons, count } = await db_1.Lesson.findAndCountAll({
            where: { unitId },
            include: [{ model: db_1.Question, as: "questions" }],
            order: [["order", "ASC"]],
            limit,
            offset,
        });
        return { lessons, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }
    static async createLesson(data) {
        return db_1.Lesson.create(data);
    }
    static async updateLesson(id, data) {
        const lesson = await db_1.Lesson.findByPk(id);
        if (!lesson)
            return null;
        return lesson.update(data);
    }
    static async deleteLesson(id) {
        const lesson = await db_1.Lesson.findByPk(id);
        if (!lesson)
            return null;
        await lesson.destroy();
        return lesson;
    }
    static async getQuestions(lessonId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const { rows: questions, count } = await db_1.Question.findAndCountAll({
            where: { lessonId },
            order: [["difficulty", "ASC"]],
            limit,
            offset,
        });
        return { questions, total: count, page, limit, totalPages: Math.ceil(count / limit) };
    }
    static normalizeQuestion(data) {
        const type = data.type || "mcq";
        const normalized = { ...data, type };
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
    static async createQuestion(data) {
        const normalized = this.normalizeQuestion(data);
        return db_1.Question.create(normalized);
    }
    static async updateQuestion(id, data) {
        const question = await db_1.Question.findByPk(id);
        if (!question)
            return null;
        const normalized = this.normalizeQuestion(data);
        return question.update(normalized);
    }
    static async deleteQuestion(id) {
        const question = await db_1.Question.findByPk(id);
        if (!question)
            return null;
        await question.destroy();
        return question;
    }
    static async importCurriculum(curriculum) {
        for (const section of curriculum.sections || []) {
            const [createdSection] = await db_1.Lecture.findOrCreate({
                where: { slug: section.id },
                defaults: section,
            });
            await createdSection.update(section);
            for (const unit of section.units || []) {
                const [createdUnit] = await db_1.Unit.findOrCreate({
                    where: { slug: unit.id },
                    defaults: { ...unit, sectionId: createdSection.id },
                });
                await createdUnit.update(unit);
                for (const lesson of unit.lessons || []) {
                    const [createdLesson] = await db_1.Lesson.findOrCreate({
                        where: { stepId: lesson.id },
                        defaults: {
                            ...lesson,
                            unitId: createdUnit.id,
                            lectureId: createdSection.id,
                        },
                    });
                    await createdLesson.update(lesson);
                    for (const q of lesson.questions || []) {
                        const [question] = await db_1.Question.findOrCreate({
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
exports.CurriculumService = CurriculumService;
//# sourceMappingURL=adminCurriculumService.js.map