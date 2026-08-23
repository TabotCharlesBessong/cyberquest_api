import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./User";

export class DailyActivity extends Model<
  InferAttributes<DailyActivity>,
  InferCreationAttributes<DailyActivity>
> {
  declare userId: string;
  declare date: string;
  declare xpEarned: CreationOptional<number>;
  declare lessonsCompleted: CreationOptional<number>;
  declare quizzesPassed: CreationOptional<number>;
  declare lastActionAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

export function initDailyActivity(sequelize: Sequelize): void {
  DailyActivity.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "user_id",
      },
      date: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      xpEarned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "xp_earned",
      },
      lessonsCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "lessons_completed",
      },
      quizzesPassed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "quizzes_passed",
      },
      lastActionAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "last_action_at",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      tableName: "daily_activities",
    }
  );
}

// Associations
export function associateDailyActivity() {
  DailyActivity.belongsTo(User, { foreignKey: "userId", as: "user" });
  User.hasMany(DailyActivity, { foreignKey: "userId", as: "dailyActivities" });
}
