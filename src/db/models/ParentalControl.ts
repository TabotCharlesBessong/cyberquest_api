import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";
import { User } from "./User";

export class ParentalControl extends Model<
  InferAttributes<ParentalControl>,
  InferCreationAttributes<ParentalControl>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<string>;
  declare parentId: ForeignKey<string> | null;
  declare dailyScreenTimeLimit: CreationOptional<number>;
  declare allowedHoursStart: CreationOptional<string>;
  declare allowedHoursEnd: CreationOptional<string>;
  declare blockedDays: CreationOptional<string[]>;
  declare requireApprovalForLessons: CreationOptional<boolean>;
  declare maxDailyLessons: CreationOptional<number>;
  declare allowChat: CreationOptional<boolean>;
  declare allowSocialFeatures: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initParentalControl(sequelize: Sequelize): void {
  ParentalControl.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        field: "user_id",
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
        field: "parent_id",
      },
      dailyScreenTimeLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
        field: "daily_screen_time_limit",
      },
      allowedHoursStart: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "08:00",
        field: "allowed_hours_start",
      },
      allowedHoursEnd: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "20:00",
        field: "allowed_hours_end",
      },
      blockedDays: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: "blocked_days",
      },
      requireApprovalForLessons: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "require_approval_for_lessons",
      },
      maxDailyLessons: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
        field: "max_daily_lessons",
      },
      allowChat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "allow_chat",
      },
      allowSocialFeatures: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "allow_social_features",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName: "parental_controls",
    }
  );
}

export function associateParentalControl() {
  ParentalControl.belongsTo(User, { foreignKey: "userId", as: "child" });
  ParentalControl.belongsTo(User, { foreignKey: "parentId", as: "parent" });
  User.hasMany(ParentalControl, { foreignKey: "userId", as: "parentalControls" });
  User.hasMany(ParentalControl, { foreignKey: "parentId", as: "managedChildren" });
}
