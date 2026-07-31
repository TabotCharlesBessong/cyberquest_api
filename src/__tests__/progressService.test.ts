import { ProgressService } from '../services/progressService';

jest.mock('../services/gamificationService', () => ({
  GamificationService: {
    recordDailyActivity: jest.fn(),
    updateStreak: jest.fn(),
  },
}));

jest.mock('../services/badgeService', () => ({
  BadgeService: {
    checkAndAwardBadges: jest.fn(),
  },
}));

jest.mock('../services/questService', () => ({
  QuestService: {
    updateQuestProgress: jest.fn(),
  },
}));

jest.mock('../db/models/Lesson', () => ({
  Lesson: { findByPk: jest.fn(), count: jest.fn(), findAll: jest.fn() },
}));

jest.mock('../db/models/Lecture', () => ({
  Lecture: { findByPk: jest.fn() },
}));

jest.mock('../db/models/User', () => ({
  User: { increment: jest.fn(), findByPk: jest.fn() },
}));

jest.mock('../db', () => ({
  ModuleProgress: { findOrCreate: jest.fn() },
  LessonProgress: { findOrCreate: jest.fn(), count: jest.fn() },
}));

jest.mock('../utils/apiError', () => ({
  notFound: (msg: string) => new Error(msg),
}));

describe('ProgressService scoring', () => {
  const mockLesson = {
    id: 'lesson-1',
    lectureId: 'lecture-1',
  };

  const mockLecture = {
    id: 'lecture-1',
    title: 'Test Lecture',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const { Lesson } = require('../db/models/Lesson');
    const { Lecture } = require('../db/models/Lecture');
    const { User } = require('../db/models/User');
    const { ModuleProgress } = require('../db');
    const { LessonProgress } = require('../db');

    (Lesson.findByPk as jest.Mock).mockResolvedValue(mockLesson);
    (Lesson.count as jest.Mock).mockResolvedValue(1);
    (Lesson.findAll as jest.Mock).mockResolvedValue([{ id: 'lesson-1' }]);
    (Lecture.findByPk as jest.Mock).mockResolvedValue(mockLecture);
    (User.increment as jest.Mock).mockResolvedValue([]);
    (User.findByPk as jest.Mock).mockResolvedValue({ id: 'user-1', xp: 0, level: 1, save: jest.fn() });
    (ModuleProgress.findOrCreate as jest.Mock).mockResolvedValue([
      { isNewRecord: true, id: 'mp-1', xpEarned: 0, score: null, save: jest.fn() },
      true,
    ]);
    (LessonProgress.findOrCreate as jest.Mock).mockResolvedValue([
      { isNewRecord: true, attempts: 1, correct: 0, bestScore: null, completed: false, lastResult: null, save: jest.fn() },
      true,
    ]);
    (LessonProgress.count as jest.Mock).mockResolvedValue(1);
  });

  test('all correct answers awards maximum XP', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 100, 5, 5);
    expect(result.xpEarned).toBe(50);
  });

  test('partial correct awards reduced XP', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 60, 3, 5);
    expect(result.xpEarned).toBe(20); // 3*10 - 2*5 = 20
  });

  test('all wrong awards zero XP', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 0, 0, 5);
    expect(result.xpEarned).toBe(0);
  });

  test('score defaults to percentage-based correct count when not provided', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 80);
    expect(result.xpEarned).toBeGreaterThan(0);
  });
});
