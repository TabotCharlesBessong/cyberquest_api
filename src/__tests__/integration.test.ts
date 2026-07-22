import request from 'supertest';
import { createApp } from '../app';
import { sequelize, User, Lecture, Lesson, ModuleProgress, LessonProgress, Badge, Quest, ShopItem, UserBadge, UserQuest, UserInventory, DailyActivity } from '../db';

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
});
