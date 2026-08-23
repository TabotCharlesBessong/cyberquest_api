"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureService = void 0;
const db_1 = require("../db");
class LectureService {
    static async getAllLectures(ageGroup) {
        const lectures = await db_1.Lecture.findAll({
            include: [
                {
                    model: db_1.Lesson,
                    as: "lessons",
                    order: [["order", "ASC"]],
                    include: [
                        { model: db_1.LessonOption, as: "options", order: [["position", "ASC"]] },
                        { model: db_1.LessonChoice, as: "choices", order: [["position", "ASC"]] },
                        { model: db_1.Concept, as: "concepts" },
                        { model: db_1.Standard, as: "standards" },
                        { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
                    ],
                },
            ],
            order: [["order", "ASC"]],
        });
        return lectures.map(lecture => {
            const plain = lecture.get({ plain: true });
            let lessons = lecture.lessons || [];
            if (ageGroup) {
                lessons = lessons.filter((l) => {
                    const lg = l.ageGroup;
                    return lg === ageGroup || lg === "ALL";
                });
            }
            return {
                ...plain,
                lessons: lessons.map((lesson) => {
                    const lPlain = lesson.get({ plain: true });
                    if (lesson.options?.length) {
                        lPlain.options = lesson.options
                            .sort((a, b) => a.position - b.position)
                            .map((o) => o.text);
                    }
                    if (lesson.choices?.length) {
                        lPlain.choices = lesson.choices
                            .sort((a, b) => a.position - b.position)
                            .map((c) => ({
                            text: c.text,
                            feedback: c.feedback,
                            consequence: c.consequence,
                            xpDelta: c.xpDelta,
                        }));
                    }
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
                    if (lesson.concepts?.length) {
                        lPlain.conceptKeys = lesson.concepts.map((c) => c.code);
                    }
                    if (lesson.standards?.length) {
                        lPlain.connexusStandards = lesson.standards.map((s) => s.code);
                    }
                    return lPlain;
                }),
            };
        });
    }
    static async getLectureBySlug(slug, ageGroup) {
        const lecture = await db_1.Lecture.findOne({
            where: { slug },
            include: [
                {
                    model: db_1.Lesson,
                    as: "lessons",
                    order: [["order", "ASC"]],
                    include: [
                        { model: db_1.LessonOption, as: "options", order: [["position", "ASC"]] },
                        { model: db_1.LessonChoice, as: "choices", order: [["position", "ASC"]] },
                        { model: db_1.Concept, as: "concepts" },
                        { model: db_1.Standard, as: "standards" },
                        { model: db_1.Question, as: "questions", order: [["difficulty", "ASC"]] },
                    ],
                },
            ],
        });
        if (!lecture)
            return null;
        const plain = lecture.get({ plain: true });
        let lessons = lecture.lessons || [];
        if (ageGroup) {
            lessons = lessons.filter((l) => {
                const lg = l.ageGroup;
                return lg === ageGroup || lg === "ALL";
            });
        }
        return {
            ...plain,
            lessons: lessons.map((lesson) => {
                const lPlain = lesson.get({ plain: true });
                if (lesson.options?.length) {
                    lPlain.options = lesson.options
                        .sort((a, b) => a.position - b.position)
                        .map((o) => o.text);
                }
                if (lesson.choices?.length) {
                    lPlain.choices = lesson.choices
                        .sort((a, b) => a.position - b.position)
                        .map((c) => ({
                        text: c.text,
                        feedback: c.feedback,
                        consequence: c.consequence,
                        xpDelta: c.xpDelta,
                    }));
                }
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
                if (lesson.concepts?.length) {
                    lPlain.conceptKeys = lesson.concepts.map((c) => c.code);
                }
                if (lesson.standards?.length) {
                    lPlain.connexusStandards = lesson.standards.map((s) => s.code);
                }
                return lPlain;
            }),
        };
    }
}
exports.LectureService = LectureService;
//# sourceMappingURL=lectureService.js.map