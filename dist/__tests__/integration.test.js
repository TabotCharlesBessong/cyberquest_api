"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const db_1 = require("../db");
const leagueService_1 = require("../services/leagueService");
const app = (0, app_1.createApp)();
describe('API Integration', () => {
    beforeAll(async () => {
        await db_1.sequelize.sync({ force: true, logging: false });
    });
    afterAll(async () => {
        await db_1.sequelize.close();
    });
    describe('Auth API', () => {
        beforeEach(async () => {
            await db_1.DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserInventory.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserQuest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserBadge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lesson.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lecture.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ShopItem.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Quest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Badge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.User.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.League.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Classroom.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Event.destroy({ where: {}, truncate: true, cascade: true });
        });
        test('POST /api/auth/signup - creates a new user', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/signup')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                age: 10,
            });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('test@example.com');
            expect(res.body.data.user.password).toBeUndefined();
        });
        test('POST /api/auth/signup - rejects duplicate email', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/auth/signup')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
            });
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/signup')
                .send({
                name: 'Another User',
                email: 'test@example.com',
                password: 'password123',
            });
            expect(res.status).toBe(409);
            expect(res.body.success).toBe(false);
        });
        test('POST /api/auth/login - logs in with valid credentials', async () => {
            const user = await db_1.User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                age: 10,
                ageGroup: 'A',
                avatar: '🦊',
                isVerified: true,
            });
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123',
            });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
            expect(res.body.data.user.id).toBe(user.id);
        });
        test('POST /api/auth/login - rejects invalid credentials', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword',
            });
            expect(res.status).toBe(401);
            expect(res.body.success).toBe(false);
        });
        test('GET /api/auth/me - returns current user with valid token', async () => {
            const user = await db_1.User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                age: 10,
                ageGroup: 'A',
                avatar: '🦊',
                isVerified: true,
            });
            const loginRes = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123',
            });
            const token = loginRes.body.data.token;
            const res = await (0, supertest_1.default)(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.id).toBe(user.id);
            expect(res.body.data.user.email).toBe('test@example.com');
        });
        test('GET /api/auth/me - rejects request without token', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/auth/me');
            expect(res.status).toBe(401);
        });
    });
    describe('Lecture API', () => {
        let authToken;
        let lectureId;
        beforeEach(async () => {
            await db_1.DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserInventory.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserQuest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserBadge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lesson.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lecture.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ShopItem.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Quest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Badge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.User.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.League.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Classroom.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Event.destroy({ where: {}, truncate: true, cascade: true });
            const user = await db_1.User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                age: 10,
                ageGroup: 'A',
                avatar: '🦊',
                isVerified: true,
            });
            const lecture = await db_1.Lecture.create({
                slug: 'test-lecture',
                title: 'Test Lecture',
                subtitle: 'Test',
                icon: '📘',
                color: '#4D96FF',
                badge: '⭐',
                badgeName: 'Star',
                order: 1,
            });
            lectureId = lecture.id;
            await db_1.Lesson.create({
                lectureId: lecture.id,
                stepId: 'step-1',
                type: 'quiz',
                title: 'Test Quiz',
                question: 'What is safe?',
                answer: 0,
                explanation: 'A is safe',
                icon: '🔒',
                ageGroup: 'A',
                order: 1,
            });
            const loginRes = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });
            authToken = loginRes.body.data.token;
        });
        test('GET /api/lectures - returns all lectures', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/lectures')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.lectures).toHaveLength(1);
            expect(res.body.data.lectures[0].slug).toBe('test-lecture');
        });
        test('GET /api/lectures - filters by ageGroup query param', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/lectures?ageGroup=A')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.lectures).toHaveLength(1);
        });
        test('GET /api/lectures/:slug - returns lecture by slug', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/lectures/test-lecture')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.lecture.slug).toBe('test-lecture');
            expect(res.body.data.lecture.lessons).toHaveLength(1);
        });
        test('GET /api/lectures/:slug - returns 404 for nonexistent slug', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/lectures/nonexistent')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(404);
        });
        test('GET /api/lectures/:slug - rejects request without auth token', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/lectures/test-lecture');
            expect(res.status).toBe(401);
        });
    });
    describe('Progress API', () => {
        let authToken;
        let userId;
        let lectureId;
        let lessonId;
        beforeEach(async () => {
            await db_1.DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserInventory.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserQuest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserBadge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lesson.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lecture.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ShopItem.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Quest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Badge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.User.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.League.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Classroom.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Event.destroy({ where: {}, truncate: true, cascade: true });
            const user = await db_1.User.create({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                age: 10,
                ageGroup: 'A',
                avatar: '🦊',
                isVerified: true,
            });
            userId = user.id;
            const lecture = await db_1.Lecture.create({
                slug: 'test-lecture',
                title: 'Test Lecture',
                subtitle: 'Test',
                icon: '📘',
                color: '#4D96FF',
                badge: '⭐',
                badgeName: 'Star',
                order: 1,
            });
            lectureId = lecture.id;
            const lesson = await db_1.Lesson.create({
                lectureId: lecture.id,
                stepId: 'step-1',
                type: 'quiz',
                title: 'Test Quiz',
                question: 'What is safe?',
                answer: 0,
                explanation: 'A is safe',
                icon: '🔒',
                ageGroup: 'A',
                order: 1,
            });
            lessonId = lesson.id;
            const loginRes = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });
            authToken = loginRes.body.data.token;
        });
        test('POST /api/progress/lesson - creates lesson progress and updates module', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/progress/lesson')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ lessonId, score: 100, correctCount: 1, total: 1 });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.xpEarned).toBe(10);
            expect(res.body.data.moduleProgress.status).toBe('completed');
        });
        test('GET /api/progress/me - returns user progress with completed module', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/progress/lesson')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ lessonId, score: 100, correctCount: 1, total: 1 });
            const res = await (0, supertest_1.default)(app)
                .get('/api/progress/me')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.id).toBe(userId);
            expect(res.body.data.modules.length).toBeGreaterThanOrEqual(1);
            expect(res.body.data.modules[0].status).toBe('completed');
        });
    });
    describe('Phase 3 - Competitions & Social', () => {
        let authToken;
        let groupBUser;
        beforeEach(async () => {
            await db_1.DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserInventory.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserQuest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.UserBadge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lesson.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Lecture.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ShopItem.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Quest.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Badge.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.User.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.League.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Classroom.destroy({ where: {}, truncate: true, cascade: true });
            await db_1.Event.destroy({ where: {}, truncate: true, cascade: true });
            const user = await db_1.User.create({
                name: 'Group B Hero',
                email: 'groupb@test.com',
                password: 'password123',
                age: 10,
                ageGroup: 'B',
                avatar: '🦊',
                isVerified: true,
                xp: 500,
            });
            groupBUser = user;
            const loginRes = await (0, supertest_1.default)(app)
                .post('/api/auth/login')
                .send({ email: 'groupb@test.com', password: 'password123' });
            authToken = loginRes.body.data.token;
        });
        test('GET /api/leaderboard - returns entries for Group B', async () => {
            await (0, supertest_1.default)(app)
                .post('/api/leaderboard/recompute?scope=global')
                .set('Authorization', `Bearer ${authToken}`);
            const res = await (0, supertest_1.default)(app)
                .get('/api/leaderboard?scope=global')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.entries).toHaveLength(1);
            expect(res.body.data.entries[0].name).toBe('Group B Hero');
        });
        test('POST /api/leaderboard/recompute - rebuilds leaderboard with event multiplier', async () => {
            await db_1.Event.create({
                key: 'double-xp',
                name: 'Double XP Weekend',
                description: 'Earn 2x XP',
                multiplier: 2.0,
                startsAt: new Date(Date.now() - 86400000),
                endsAt: new Date(Date.now() + 86400000),
            });
            const res = await (0, supertest_1.default)(app)
                .post('/api/leaderboard/recompute?scope=global')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data.count).toBe(1);
            const entries = await db_1.LeaderboardEntry.findAll({ where: { scope: 'global' } });
            expect(entries[0].score).toBe(1000);
        });
        test('GET /api/leagues/me - returns league for Group B', async () => {
            await leagueService_1.LeagueService.assignMembersToLeagues(leagueService_1.LeagueService.getCurrentSeason());
            const res = await (0, supertest_1.default)(app)
                .get('/api/leagues/me')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.league).not.toBeNull();
        });
        test('POST /api/leagues/weekly-reset - promotes and demotes members', async () => {
            const lowUser = await db_1.User.create({
                name: 'Low XP',
                email: 'low@test.com',
                password: 'password123',
                age: 10,
                ageGroup: 'B',
                avatar: '🐱',
                isVerified: true,
                xp: 10,
            });
            const midUser = await db_1.User.create({
                name: 'Mid XP',
                email: 'mid@test.com',
                password: 'password123',
                age: 10,
                ageGroup: 'B',
                avatar: '🐶',
                isVerified: true,
                xp: 250,
            });
            const midUser2 = await db_1.User.create({
                name: 'Mid XP 2',
                email: 'mid2@test.com',
                password: 'password123',
                age: 10,
                ageGroup: 'B',
                avatar: '🐼',
                isVerified: true,
                xp: 200,
            });
            await leagueService_1.LeagueService.assignMembersToLeagues(leagueService_1.LeagueService.getCurrentSeason());
            const res = await (0, supertest_1.default)(app)
                .post('/api/leagues/weekly-reset')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const allHigh = await db_1.LeagueMembership.findAll({ where: { userId: groupBUser.id }, raw: true });
            const allLow = await db_1.LeagueMembership.findAll({ where: { userId: lowUser.id }, raw: true });
            const allMid = await db_1.LeagueMembership.findAll({ where: { userId: midUser.id }, raw: true });
            const allMid2 = await db_1.LeagueMembership.findAll({ where: { userId: midUser2.id }, raw: true });
            const hasAnyPromotion = [...allHigh, ...allLow, ...allMid, ...allMid2].some(m => m.promoted);
            const hasAnyDemotion = [...allHigh, ...allLow, ...allMid, ...allMid2].some(m => m.demoted);
            expect(hasAnyPromotion).toBe(true);
            expect(hasAnyDemotion).toBe(true);
        });
        test('POST /api/classroom - creates classroom with code', async () => {
            const res = await (0, supertest_1.default)(app)
                .post('/api/classroom/')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ name: 'Test Class', school: 'Test School' });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.code).toBeDefined();
            expect(res.body.data.code.length).toBeGreaterThanOrEqual(6);
        });
        test('POST /api/classroom/join - joins classroom by code', async () => {
            const classroom = await db_1.Classroom.create({
                name: 'Test Class',
                school: 'Test School',
                code: 'ABC123',
                memberIds: [],
            });
            const res = await (0, supertest_1.default)(app)
                .post('/api/classroom/join')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ code: 'ABC123' });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.memberIds).toContain(groupBUser.id);
        });
        test('POST /api/classroom/:id/round/start - starts a round', async () => {
            const classroom = await db_1.Classroom.create({
                name: 'Test Class',
                school: 'Test School',
                code: 'XYZ789',
                memberIds: [],
            });
            const questions = [
                { id: 'q1', text: 'Test?', options: ['A', 'B'], correctIndex: 0 },
            ];
            const res = await (0, supertest_1.default)(app)
                .post(`/api/classroom/${classroom.id}/round/start`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ questions });
            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.round.status).toBe('active');
        });
        test('POST /api/events/active - returns active event when exists', async () => {
            await db_1.Event.create({
                key: 'test-event',
                name: 'Test Event',
                multiplier: 1.5,
                startsAt: new Date(Date.now() - 3600000),
                endsAt: new Date(Date.now() + 3600000),
            });
            const res = await (0, supertest_1.default)(app)
                .get('/api/events/active')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data).not.toBeNull();
            expect(res.body.data.key).toBe('test-event');
        });
        test('GET /api/events/active - returns null when no active event', async () => {
            const res = await (0, supertest_1.default)(app)
                .get('/api/events/active')
                .set('Authorization', `Bearer ${authToken}`);
            expect(res.status).toBe(200);
            expect(res.body.data).toBeNull();
        });
    });
});
//# sourceMappingURL=integration.test.js.map