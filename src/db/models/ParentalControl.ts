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
      },
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onDelete: "SET NULL",
      },
      dailyScreenTimeLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      allowedHoursStart: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "08:00",
      },
      allowedHoursEnd: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "20:00",
      },
      blockedDays: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
      },
      requireApprovalForLessons: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      maxDailyLessons: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10,
      },
      allowChat: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      allowSocialFeatures: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
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
