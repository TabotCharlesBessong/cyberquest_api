import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export type LessonType = "story" | "quiz" | "mini-game" | "challenge";
export type LessonCategory = "intro" | "core" | "review" | "bridge" | "capstone";
export type AgeGroup = "A" | "B" | "ALL";

export class Lesson extends Model<
  InferAttributes<Lesson>,
  InferCreationAttributes<Lesson>
> {
  declare id: CreationOptional<string>;
  declare lectureId: ForeignKey<string>;
  declare stepId: string;
  declare type: LessonType;
  declare title: string;
  declare text: string | null;
  declare question: string | null;
  declare answer: number | null;
  declare explanation: string | null;
  declare icon: string | null;
  declare mascot: string | null;
  declare speech: string | null;
  declare ageGroup: CreationOptional<AgeGroup>;
  declare stepCategory: CreationOptional<LessonCategory>;
  declare depthLevel: CreationOptional<number>;
  declare learningObjectives: CreationOptional<string[]>;
  declare successCriteria: CreationOptional<string[]>;
  declare activityType: CreationOptional<string>;
  declare materials: CreationOptional<string[]>;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initLesson(sequelize: Sequelize): void {
  Lesson.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lectureId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "lectures", key: "id" },
        onDelete: "CASCADE",
      },
      stepId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("story", "quiz", "mini-game", "challenge"),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      answer: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mascot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      speech: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ageGroup: {
        type: DataTypes.ENUM("A", "B", "ALL"),
        allowNull: false,
        defaultValue: "B",
      },
      stepCategory: {
        type: DataTypes.ENUM("intro", "core", "review", "bridge", "capstone"),
        allowNull: false,
        defaultValue: "core",
      },
      depthLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 1, max: 6 },
      },
      learningObjectives: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      successCriteria: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      activityType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      materials: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "lessons",
    }
  );
}
