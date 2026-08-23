"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lectureService_1 = require("../services/lectureService");
jest.mock('../db', () => ({
    sequelize: {},
    Lecture: {
        findAll: jest.fn(),
        findOne: jest.fn(),
    },
    Lesson: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
    },
    LessonOption: {
        findAll: jest.fn(),
    },
    LessonChoice: {
        findAll: jest.fn(),
    },
    Concept: {
        findAll: jest.fn(),
    },
    Standard: {
        findAll: jest.fn(),
    },
    User: {},
    ModuleProgress: {},
    LessonProgress: {},
}));
describe('LectureService', () => {
    const mockLesson = {
        id: 'lesson-1',
        lectureId: 'lecture-1',
        stepId: 'step-1',
        type: 'quiz',
        title: 'Test Quiz',
        question: 'What is safe?',
        answer: 0,
        explanation: 'A is safe',
        icon: '🔒',
        ageGroup: 'A',
        order: 1,
        get: jest.fn(),
    };
    const mockLecture = {
        id: 'lecture-1',
        slug: 'test-lecture',
        title: 'Test Lecture',
        subtitle: 'Test',
        icon: '📘',
        color: '#4D96FF',
        badge: '⭐',
        badgeName: 'Star',
        order: 1,
        get: jest.fn(),
        lessons: [mockLesson],
    };
    beforeEach(() => {
        jest.clearAllMocks();
        const db = require('../db');
        mockLecture.get.mockReturnValue({
            id: 'lecture-1',
            slug: 'test-lecture',
            title: 'Test Lecture',
            subtitle: 'Test',
            icon: '📘',
            color: '#4D96FF',
            badge: '⭐',
            badgeName: 'Star',
            order: 1,
            lessons: [mockLesson],
        });
        mockLesson.get.mockReturnValue({
            id: 'lesson-1',
            lectureId: 'lecture-1',
            stepId: 'step-1',
            type: 'quiz',
            title: 'Test Quiz',
            question: 'What is safe?',
            answer: 0,
            explanation: 'A is safe',
            icon: '🔒',
            ageGroup: 'A',
            order: 1,
            options: null,
            choices: null,
            concepts: null,
            standards: null,
        });
        db.Lecture.findAll.mockResolvedValue([mockLecture]);
        db.Lecture.findOne.mockResolvedValue(mockLecture);
        db.Lesson.findAll.mockResolvedValue([]);
    });
    describe('getAllLectures', () => {
        test('returns all lectures with lessons', async () => {
            const result = await lectureService_1.LectureService.getAllLectures();
            expect(result).toHaveLength(1);
            expect(result[0].slug).toBe('test-lecture');
            expect(result[0].lessons).toHaveLength(1);
            expect(result[0].lessons[0].title).toBe('Test Quiz');
        });
        test('filters lessons by ageGroup', async () => {
            const result = await lectureService_1.LectureService.getAllLectures('A');
            expect(result[0].lessons).toHaveLength(1);
            expect(result[0].lessons[0].ageGroup).toBe('A');
        });
        test('includes ALL ageGroup lessons when filtering', async () => {
            const allAgeLesson = {
                ...mockLesson,
                id: 'lesson-2',
                ageGroup: 'ALL',
                get: jest.fn().mockReturnValue({
                    id: 'lesson-2',
                    lectureId: 'lecture-1',
                    stepId: 'step-2',
                    type: 'quiz',
                    title: 'All Ages Quiz',
                    ageGroup: 'ALL',
                    options: null,
                    choices: null,
                    concepts: null,
                    standards: null,
                }),
            };
            const lectureWithBoth = {
                ...mockLecture,
                lessons: [mockLesson, allAgeLesson],
            };
            const db = require('../db');
            db.Lecture.findAll.mockResolvedValue([lectureWithBoth]);
            const result = await lectureService_1.LectureService.getAllLectures('A');
            expect(result[0].lessons).toHaveLength(2);
        });
        test('transforms options to text array', async () => {
            const lessonWithOptions = {
                ...mockLesson,
                options: [
                    { position: 1, text: 'Option A' },
                    { position: 2, text: 'Option B' },
                ],
                get: jest.fn().mockReturnValue({
                    ...mockLesson.get(),
                    options: [
                        { position: 1, text: 'Option A' },
                        { position: 2, text: 'Option B' },
                    ],
                }),
            };
            const lectureWithOptions = {
                ...mockLecture,
                lessons: [lessonWithOptions],
            };
            const db = require('../db');
            db.Lecture.findAll.mockResolvedValue([lectureWithOptions]);
            const result = await lectureService_1.LectureService.getAllLectures();
            expect(result[0].lessons[0].options).toEqual(['Option A', 'Option B']);
        });
        test('transforms choices to simplified format', async () => {
            const lessonWithChoices = {
                ...mockLesson,
                choices: [
                    { position: 1, text: 'Choice A', feedback: 'Good', consequence: 'xp', xpDelta: 10 },
                    { position: 2, text: 'Choice B', feedback: 'Bad', consequence: 'hp', xpDelta: -5 },
                ],
                get: jest.fn().mockReturnValue({
                    ...mockLesson.get(),
                    choices: [
                        { position: 1, text: 'Choice A', feedback: 'Good', consequence: 'xp', xpDelta: 10 },
                        { position: 2, text: 'Choice B', feedback: 'Bad', consequence: 'hp', xpDelta: -5 },
                    ],
                }),
            };
            const lectureWithChoices = {
                ...mockLecture,
                lessons: [lessonWithChoices],
            };
            const db = require('../db');
            db.Lecture.findAll.mockResolvedValue([lectureWithChoices]);
            const result = await lectureService_1.LectureService.getAllLectures();
            expect(result[0].lessons[0].choices).toEqual([
                { text: 'Choice A', feedback: 'Good', consequence: 'xp', xpDelta: 10 },
                { text: 'Choice B', feedback: 'Bad', consequence: 'hp', xpDelta: -5 },
            ]);
        });
        test('transforms concepts to conceptKeys', async () => {
            const lessonWithConcepts = {
                ...mockLesson,
                concepts: [{ code: 'CS1' }, { code: 'CS2' }],
                get: jest.fn().mockReturnValue({
                    ...mockLesson.get(),
                    concepts: [{ code: 'CS1' }, { code: 'CS2' }],
                }),
            };
            const lectureWithConcepts = {
                ...mockLecture,
                lessons: [lessonWithConcepts],
            };
            const db = require('../db');
            db.Lecture.findAll.mockResolvedValue([lectureWithConcepts]);
            const result = await lectureService_1.LectureService.getAllLectures();
            expect(result[0].lessons[0].conceptKeys).toEqual(['CS1', 'CS2']);
        });
        test('transforms standards to connexusStandards', async () => {
            const lessonWithStandards = {
                ...mockLesson,
                standards: [{ code: 'ST1' }, { code: 'ST2' }],
                get: jest.fn().mockReturnValue({
                    ...mockLesson.get(),
                    standards: [{ code: 'ST1' }, { code: 'ST2' }],
                }),
            };
            const lectureWithStandards = {
                ...mockLecture,
                lessons: [lessonWithStandards],
            };
            const db = require('../db');
            db.Lecture.findAll.mockResolvedValue([lectureWithStandards]);
            const result = await lectureService_1.LectureService.getAllLectures();
            expect(result[0].lessons[0].connexusStandards).toEqual(['ST1', 'ST2']);
        });
        test('returns empty array when no lectures exist', async () => {
            const db = require('../db');
            db.Lecture.findAll.mockResolvedValue([]);
            const result = await lectureService_1.LectureService.getAllLectures();
            expect(result).toEqual([]);
        });
    });
    describe('getLectureBySlug', () => {
        test('returns lecture by slug', async () => {
            const result = await lectureService_1.LectureService.getLectureBySlug('test-lecture');
            expect(result).toBeDefined();
            expect(result?.slug).toBe('test-lecture');
            expect(result?.lessons).toHaveLength(1);
        });
        test('returns null if lecture not found', async () => {
            const db = require('../db');
            db.Lecture.findOne.mockResolvedValue(null);
            const result = await lectureService_1.LectureService.getLectureBySlug('nonexistent');
            expect(result).toBeNull();
        });
        test('filters lessons by ageGroup', async () => {
            const result = await lectureService_1.LectureService.getLectureBySlug('test-lecture', 'A');
            expect(result?.lessons).toHaveLength(1);
        });
    });
});
//# sourceMappingURL=lectureService.test.js.map