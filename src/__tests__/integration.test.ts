import request from 'supertest';
import { createApp } from '../app';
import { sequelize, User, Lecture, Lesson, ModuleProgress, LessonProgress, Badge, Quest, ShopItem, UserBadge, UserQuest, UserInventory, DailyActivity, LeaderboardEntry, League, LeagueMembership, Classroom, ClassroomRound, ClassroomParticipant, Event } from '../db';
import { LeagueService } from '../services/leagueService';

const app = createApp();

describe('API Integration', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true, logging: false });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Auth API', () => {
    beforeEach(async () => {
      await DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
      await UserInventory.destroy({ where: {}, truncate: true, cascade: true });
      await UserQuest.destroy({ where: {}, truncate: true, cascade: true });
      await UserBadge.destroy({ where: {}, truncate: true, cascade: true });
      await LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
      await ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
      await Lesson.destroy({ where: {}, truncate: true, cascade: true });
      await Lecture.destroy({ where: {}, truncate: true, cascade: true });
      await ShopItem.destroy({ where: {}, truncate: true, cascade: true });
      await Quest.destroy({ where: {}, truncate: true, cascade: true });
      await Badge.destroy({ where: {}, truncate: true, cascade: true });
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
      await LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
      await League.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
      await Classroom.destroy({ where: {}, truncate: true, cascade: true });
      await Event.destroy({ where: {}, truncate: true, cascade: true });
    });

    test('POST /api/auth/signup - creates a new user', async () => {
      const res = await request(app)
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
      await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      const res = await request(app)
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
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 10,
        ageGroup: 'A',
        avatar: '🦊',
        isVerified: true,
      } as any);

      const res = await request(app)
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
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('GET /api/auth/me - returns current user with valid token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 10,
        ageGroup: 'A',
        avatar: '🦊',
        isVerified: true,
      } as any);

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      const token = loginRes.body.data.token;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.id).toBe(user.id);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    test('GET /api/auth/me - rejects request without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });

  describe('Lecture API', () => {
    let authToken: string;
    let lectureId: string;

    beforeEach(async () => {
      await DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
      await UserInventory.destroy({ where: {}, truncate: true, cascade: true });
      await UserQuest.destroy({ where: {}, truncate: true, cascade: true });
      await UserBadge.destroy({ where: {}, truncate: true, cascade: true });
      await LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
      await ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
      await Lesson.destroy({ where: {}, truncate: true, cascade: true });
      await Lecture.destroy({ where: {}, truncate: true, cascade: true });
      await ShopItem.destroy({ where: {}, truncate: true, cascade: true });
      await Quest.destroy({ where: {}, truncate: true, cascade: true });
      await Badge.destroy({ where: {}, truncate: true, cascade: true });
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
      await LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
      await League.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
      await Classroom.destroy({ where: {}, truncate: true, cascade: true });
      await Event.destroy({ where: {}, truncate: true, cascade: true });

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 10,
        ageGroup: 'A',
        avatar: '🦊',
        isVerified: true,
      } as any);

      const lecture = await Lecture.create({
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

      await Lesson.create({
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

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      authToken = loginRes.body.data.token;
    });

    test('GET /api/lectures - returns all lectures', async () => {
      const res = await request(app)
        .get('/api/lectures')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lectures).toHaveLength(1);
      expect(res.body.data.lectures[0].slug).toBe('test-lecture');
    });

    test('GET /api/lectures - filters by ageGroup query param', async () => {
      const res = await request(app)
        .get('/api/lectures?ageGroup=A')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lectures).toHaveLength(1);
    });

    test('GET /api/lectures/:slug - returns lecture by slug', async () => {
      const res = await request(app)
        .get('/api/lectures/test-lecture')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.lecture.slug).toBe('test-lecture');
      expect(res.body.data.lecture.lessons).toHaveLength(1);
    });

    test('GET /api/lectures/:slug - returns 404 for nonexistent slug', async () => {
      const res = await request(app)
        .get('/api/lectures/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    test('GET /api/lectures/:slug - rejects request without auth token', async () => {
      const res = await request(app)
        .get('/api/lectures/test-lecture');

      expect(res.status).toBe(401);
    });
  });

  describe('Progress API', () => {
    let authToken: string;
    let userId: string;
    let lectureId: string;
    let lessonId: string;

    beforeEach(async () => {
      await DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
      await UserInventory.destroy({ where: {}, truncate: true, cascade: true });
      await UserQuest.destroy({ where: {}, truncate: true, cascade: true });
      await UserBadge.destroy({ where: {}, truncate: true, cascade: true });
      await LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
      await ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
      await Lesson.destroy({ where: {}, truncate: true, cascade: true });
      await Lecture.destroy({ where: {}, truncate: true, cascade: true });
      await ShopItem.destroy({ where: {}, truncate: true, cascade: true });
      await Quest.destroy({ where: {}, truncate: true, cascade: true });
      await Badge.destroy({ where: {}, truncate: true, cascade: true });
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
      await LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
      await League.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
      await Classroom.destroy({ where: {}, truncate: true, cascade: true });
      await Event.destroy({ where: {}, truncate: true, cascade: true });

      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        age: 10,
        ageGroup: 'A',
        avatar: '🦊',
        isVerified: true,
      } as any);
      userId = user.id;

      const lecture = await Lecture.create({
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

      const lesson = await Lesson.create({
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

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      authToken = loginRes.body.data.token;
    });

    test('POST /api/progress/lesson - creates lesson progress and updates module', async () => {
      const res = await request(app)
        .post('/api/progress/lesson')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ lessonId, score: 100, correctCount: 1, total: 1 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.xpEarned).toBe(10);
      expect(res.body.data.moduleProgress.status).toBe('completed');
    });

    test('GET /api/progress/me - returns user progress with completed module', async () => {
      await request(app)
        .post('/api/progress/lesson')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ lessonId, score: 100, correctCount: 1, total: 1 });

      const res = await request(app)
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
    let authToken: string;
    let groupBUser: any;

    beforeEach(async () => {
      await DailyActivity.destroy({ where: {}, truncate: true, cascade: true });
      await UserInventory.destroy({ where: {}, truncate: true, cascade: true });
      await UserQuest.destroy({ where: {}, truncate: true, cascade: true });
      await UserBadge.destroy({ where: {}, truncate: true, cascade: true });
      await LessonProgress.destroy({ where: {}, truncate: true, cascade: true });
      await ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
      await Lesson.destroy({ where: {}, truncate: true, cascade: true });
      await Lecture.destroy({ where: {}, truncate: true, cascade: true });
      await ShopItem.destroy({ where: {}, truncate: true, cascade: true });
      await Quest.destroy({ where: {}, truncate: true, cascade: true });
      await Badge.destroy({ where: {}, truncate: true, cascade: true });
      await User.destroy({ where: {}, truncate: true, cascade: true });
      await LeaderboardEntry.destroy({ where: {}, truncate: true, cascade: true });
      await LeagueMembership.destroy({ where: {}, truncate: true, cascade: true });
      await League.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomParticipant.destroy({ where: {}, truncate: true, cascade: true });
      await ClassroomRound.destroy({ where: {}, truncate: true, cascade: true });
      await Classroom.destroy({ where: {}, truncate: true, cascade: true });
      await Event.destroy({ where: {}, truncate: true, cascade: true });

      const user = await User.create({
        name: 'Group B Hero',
        email: 'groupb@test.com',
        password: 'password123',
        age: 10,
        ageGroup: 'B',
        avatar: '🦊',
        isVerified: true,
        xp: 500,
      } as any);
      groupBUser = user;

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'groupb@test.com', password: 'password123' });

      authToken = loginRes.body.data.token;
    });

    test('GET /api/leaderboard - returns entries for Group B', async () => {
      await request(app)
        .post('/api/leaderboard/recompute?scope=global')
        .set('Authorization', `Bearer ${authToken}`);

      const res = await request(app)
        .get('/api/leaderboard?scope=global')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.entries).toHaveLength(1);
      expect(res.body.data.entries[0].name).toBe('Group B Hero');
    });

    test('POST /api/leaderboard/recompute - rebuilds leaderboard with event multiplier', async () => {
      await Event.create({
        key: 'double-xp',
        name: 'Double XP Weekend',
        description: 'Earn 2x XP',
        multiplier: 2.0,
        startsAt: new Date(Date.now() - 86400000),
        endsAt: new Date(Date.now() + 86400000),
      } as any);

      const res = await request(app)
        .post('/api/leaderboard/recompute?scope=global')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.count).toBe(1);

      const entries = await LeaderboardEntry.findAll({ where: { scope: 'global' } });
      expect(entries[0].score).toBe(1000);
    });

    test('GET /api/leagues/me - returns league for Group B', async () => {
      await LeagueService.assignMembersToLeagues(LeagueService.getCurrentSeason());

      const res = await request(app)
        .get('/api/leagues/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.league).not.toBeNull();
    });

    test('POST /api/leagues/weekly-reset - promotes and demotes members', async () => {
      const lowUser = await User.create({
        name: 'Low XP',
        email: 'low@test.com',
        password: 'password123',
        age: 10,
        ageGroup: 'B',
        avatar: '🐱',
        isVerified: true,
        xp: 10,
      } as any);

      const midUser = await User.create({
        name: 'Mid XP',
        email: 'mid@test.com',
        password: 'password123',
        age: 10,
        ageGroup: 'B',
        avatar: '🐶',
        isVerified: true,
        xp: 250,
      } as any);

      const midUser2 = await User.create({
        name: 'Mid XP 2',
        email: 'mid2@test.com',
        password: 'password123',
        age: 10,
        ageGroup: 'B',
        avatar: '🐼',
        isVerified: true,
        xp: 200,
      } as any);

      await LeagueService.assignMembersToLeagues(LeagueService.getCurrentSeason());

      const res = await request(app)
        .post('/api/leagues/weekly-reset')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const allHigh = await LeagueMembership.findAll({ where: { userId: groupBUser.id }, raw: true });
      const allLow = await LeagueMembership.findAll({ where: { userId: lowUser.id }, raw: true });
      const allMid = await LeagueMembership.findAll({ where: { userId: midUser.id }, raw: true });
      const allMid2 = await LeagueMembership.findAll({ where: { userId: midUser2.id }, raw: true });

      const hasAnyPromotion = [...allHigh, ...allLow, ...allMid, ...allMid2].some(m => m.promoted);
      const hasAnyDemotion = [...allHigh, ...allLow, ...allMid, ...allMid2].some(m => m.demoted);

      expect(hasAnyPromotion).toBe(true);
      expect(hasAnyDemotion).toBe(true);
    });

    test('POST /api/classroom - creates classroom with code', async () => {
      const res = await request(app)
        .post('/api/classroom/')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Class', school: 'Test School' });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBeDefined();
      expect(res.body.data.code.length).toBeGreaterThanOrEqual(6);
    });

    test('POST /api/classroom/join - joins classroom by code', async () => {
      const classroom = await Classroom.create({
        name: 'Test Class',
        school: 'Test School',
        code: 'ABC123',
        memberIds: [],
      } as any);

      const res = await request(app)
        .post('/api/classroom/join')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ code: 'ABC123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.memberIds).toContain(groupBUser.id);
    });

    test('POST /api/classroom/:id/round/start - starts a round', async () => {
      const classroom = await Classroom.create({
        name: 'Test Class',
        school: 'Test School',
        code: 'XYZ789',
        memberIds: [],
      } as any);

      const questions = [
        { id: 'q1', text: 'Test?', options: ['A', 'B'], correctIndex: 0 },
      ];

      const res = await request(app)
        .post(`/api/classroom/${classroom.id}/round/start`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ questions });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.round.status).toBe('active');
    });

    test('POST /api/events/active - returns active event when exists', async () => {
      await Event.create({
        key: 'test-event',
        name: 'Test Event',
        multiplier: 1.5,
        startsAt: new Date(Date.now() - 3600000),
        endsAt: new Date(Date.now() + 3600000),
      } as any);

      const res = await request(app)
        .get('/api/events/active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).not.toBeNull();
      expect(res.body.data.key).toBe('test-event');
    });

    test('GET /api/events/active - returns null when no active event', async () => {
      const res = await request(app)
        .get('/api/events/active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeNull();
    });
  });
});
