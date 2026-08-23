import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export class LessonProgress extends Model<
  InferAttributes<LessonProgress>,
  InferCreationAttributes<LessonProgress>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<string>;
  declare lessonId: ForeignKey<string>;
  declare attempts: number;
  declare correct: number;
  declare bestScore: number | null;
  declare completed: boolean;
  declare lastResult: "pass" | "fail" | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initLessonProgress(sequelize: Sequelize): void {
  LessonProgress.init(
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
      lessonId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "lessons", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        field: "lesson_id",
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correct: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      bestScore: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "best_score",
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastResult: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "last_result",
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
      tableName: "lesson_progress",
    }
  );
}
