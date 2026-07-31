import { User, DailyActivity } from "../db";
import { Op } from "sequelize";

export class GamificationService {
  static LEVEL_BASE_XP = 100;

  static calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / this.LEVEL_BASE_XP)) + 1;
  }

  static xpForNextLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    const nextLevelXp = Math.pow(currentLevel, 2) * this.LEVEL_BASE_XP;
    return nextLevelXp - currentXp;
  }

  static xpIntoLevel(currentXp: number): number {
    const currentLevel = this.calculateLevel(currentXp);
    const levelStartXp = Math.pow(currentLevel - 1, 2) * this.LEVEL_BASE_XP;
    return currentXp - levelStartXp;
  }

  static async addXp(userId: string, amount: number, source: string) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    const oldLevel = user.level;
    user.xp = Math.max(0, user.xp + amount);
    user.level = this.calculateLevel(user.xp);

    await user.save();

    return { xp: user.xp, level: user.level, leveledUp: user.level > oldLevel };
  }

  static async recordDailyActivity(
    userId: string,
    date: string,
    xpEarned: number,
    lessonsCompleted: number,
    quizzesPassed: number
  ) {
    const [activity] = await DailyActivity.findOrCreate({
      where: { userId, date },
      defaults: { userId, date, xpEarned, lessonsCompleted, quizzesPassed },
    });

    if (!activity.isNewRecord) {
      activity.xpEarned += xpEarned;
      activity.lessonsCompleted += lessonsCompleted;
      activity.quizzesPassed += quizzesPassed;
      await activity.save();
    }

    return activity;
  }

  static async getStreak(userId: string): Promise<number> {
    const activities = await DailyActivity.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      limit: 30,
    });

    if (activities.length === 0) return 0;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (activities[0].date !== today && activities[0].date !== yesterday) {
      return 0;
    }

    let streak = 1;
    for (let i = 0; i < activities.length - 1; i++) {
      const current = new Date(activities[i].date);
      const next = new Date(activities[i + 1].date);
      const diffDays = Math.round((current.getTime() - next.getTime()) / 86400000);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  static async updateStreak(userId: string) {
    const today = new Date().toISOString().split("T")[0];
    const streak = await this.getStreak(userId);

    await User.update(
      { streak },
      { where: { id: userId } }
    );

    return streak;
  }

  static async consumeHeart(userId: string): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user || user.hearts <= 0) return false;

    user.hearts -= 1;
    await user.save();
    return true;
  }

  static async replenishHearts(userId: string, amount: number = 5) {
    const user = await User.findByPk(userId);
    if (!user) return null;

    user.hearts = Math.min(user.hearts + amount, 10);
    await user.save();
    return user.hearts;
  }

  static async addGems(userId: string, amount: number) {
    const user = await User.findByPk(userId);
    if (!user) return null;

    user.gems += amount;
    await user.save();
    return user.gems;
  }

  static async spendGems(userId: string, amount: number): Promise<boolean> {
    const user = await User.findByPk(userId);
    if (!user || user.gems < amount) return false;

    user.gems -= amount;
    await user.save();
    return true;
  }
}
