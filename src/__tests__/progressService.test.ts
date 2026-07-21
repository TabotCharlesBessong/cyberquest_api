import { ProgressService } from '../../services/progressService';
import { sequelize, User, Lecture, Lesson, ModuleProgress, LessonProgress } from '../../db';

jest.mock('../../db', () => ({
  ...jest.requireActual('../../db'),
  Lesson: { findByPk: jest.fn(), count: jest.fn(), findAll: jest.fn() },
  Lecture: { findByPk: jest.fn() },
  User: { increment: jest.fn(), findByPk: jest.fn() },
  ModuleProgress: { findOrCreate: jest.fn() },
  LessonProgress: { findOrCreate: jest.fn(), count: jest.fn() },
}));

const mockLesson = {
  id: 'lesson-1',
  lectureId: 'lecture-1',
  findByPk: jest.fn(),
};

const mockLecture = {
  id: 'lecture-1',
  title: 'Test Lecture',
  findByPk: jest.fn(),
};

describe('ProgressService scoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Lesson.findByPk as jest.Mock).mockResolvedValue(mockLesson);
    (Lecture.findByPk as jest.Mock).mockResolvedValue(mockLecture);
    (Lesson.count as jest.Mock).mockResolvedValue(1);
    (Lesson.findAll as jest.Mock).mockResolvedValue([{ id: 'lesson-1' }]);
    (LessonProgress.count as jest.Mock).mockResolvedValue(1);
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
  });

  test('all correct answers awards maximum XP', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 100, 5, 5);
    expect(result.xpEarned).toBe(50); // 5 * 10 - 0 * 5
  });

  test('partial correct awards reduced XP', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 60, 3, 5);
    expect(result.xpEarned).toBe(25); // 3 * 10 - 2 * 5
  });

  test('all wrong awards zero XP', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 0, 0, 5);
    expect(result.xpEarned).toBe(0); // 0 * 10 - 5 * 5 = -25 -> clamped to 0
  });

  test('score defaults to percentage-based correct count when not provided', async () => {
    const result = await ProgressService.submitLessonProgress('user-1', 'lesson-1', 80);
    expect(result.xpEarned).toBeGreaterThan(0);
  });
});
