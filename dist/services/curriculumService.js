"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurriculumService = void 0;
const db_1 = require("../db");
class CurriculumService {
    static async getSections(ageGroup) {
        const sections = await db_1.Lecture.findAll({
            include: [
                {
                    model: db_1.Unit,
                    as: "units",
                    order: [["order", "ASC"]],
                    include: [
                        {
                            model: db_1.Lesson,
                            as: "lessons",
                            order: [["order", "ASC"]],
                            include: [
                                { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
                            ],
                        },
                    ],
                },
            ],
            order: [["order", "ASC"]],
        });
        return sections.map(section => {
            const plain = section.get({ plain: true });
            let units = section.units || [];
            if (ageGroup) {
                units = units.filter((u) => u.ageGroup === ageGroup || u.ageGroup === "ALL");
            }
            if (units.length === 0) {
                return null;
            }
            return {
                ...plain,
                units: units.map((unit) => {
                    const uPlain = unit.get({ plain: true });
                    let lessons = unit.lessons || [];
                    if (ageGroup) {
                        lessons = lessons.filter((l) => l.ageGroup === ageGroup || l.ageGroup === "ALL");
                    }
                    return {
                        ...uPlain,
                        lessons: lessons.map((lesson) => {
                            const lPlain = lesson.get({ plain: true });
                            if (lesson.questions?.length) {
                                lPlain.questions = lesson.questions.map((q) => ({
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
        }).filter((s) => s !== null);
    }
    static async getSectionBySlug(slug, ageGroup) {
        const section = await db_1.Lecture.findOne({
            where: { slug },
            include: [
                {
                    model: db_1.Unit,
                    as: "units",
                    order: [["order", "ASC"]],
                    include: [
                        {
                            model: db_1.Lesson,
                            as: "lessons",
                            order: [["order", "ASC"]],
                            include: [
                                { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
                            ],
                        },
                    ],
                },
            ],
        });
        if (!section)
            return null;
        const plain = section.get({ plain: true });
        let units = section.units || [];
        if (ageGroup) {
            units = units.filter((u) => u.ageGroup === ageGroup || u.ageGroup === "ALL");
        }
        if (units.length === 0) {
            return null;
        }
        return {
            ...plain,
            units: units.map((unit) => {
                const uPlain = unit.get({ plain: true });
                let lessons = unit.lessons || [];
                if (ageGroup) {
                    lessons = lessons.filter((l) => l.ageGroup === ageGroup || l.ageGroup === "ALL");
                }
                return {
                    ...uPlain,
                    lessons: lessons.map((lesson) => {
                        const lPlain = lesson.get({ plain: true });
                        if (lesson.questions?.length) {
                            lPlain.questions = lesson.questions.map((q) => ({
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
    static async getUnits(sectionId) {
        return db_1.Unit.findAll({
            where: { sectionId },
            include: [
                {
                    model: db_1.Lesson,
                    as: "lessons",
                    order: [["order", "ASC"]],
                    include: [
                        { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
                    ],
                },
            ],
            order: [["order", "ASC"]],
        });
    }
    static async getUnitById(id) {
        return db_1.Unit.findOne({
            where: { id },
            include: [
                {
                    model: db_1.Lesson,
                    as: "lessons",
                    order: [["order", "ASC"]],
                    include: [
                        { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
                    ],
                },
            ],
        });
    }
    static async getLessons(unitId) {
        return db_1.Lesson.findAll({
            where: { unitId },
            include: [
                { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
            ],
            order: [["order", "ASC"]],
        });
    }
    static async getLessonById(id) {
        return db_1.Lesson.findOne({
            where: { id },
            include: [
                { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
            ],
        });
    }
}
exports.CurriculumService = CurriculumService;
//# sourceMappingURL=curriculumService.js.map