import request from 'supertest';
import { createApp } from '../app';
import { sequelize, User, Lecture, Lesson, ModuleProgress, LessonProgress } from '../db';

const app = createApp();

describe('Progress API Integration', () => {
  let authToken: string;
  let userId: string;
  let lectureId: string;
  let lessonId: string;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    await User.destroy({ where: {}, truncate: true, cascade: true });
    await Lecture.destroy({ where: {}, truncate: true, cascade: true });
    await Lesson.destroy({ where: {}, truncate: true, cascade: true });
    await ModuleProgress.destroy({ where: {}, truncate: true, cascade: true });
    await LessonProgress.destroy({ where: {}, truncate: true, cascade: true });

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
