import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export class Question extends Model<
  InferAttributes<Question>,
  InferCreationAttributes<Question>
> {
  declare id: CreationOptional<string>;
  declare lessonId: ForeignKey<string>;
  declare slug: string;
  declare type: CreationOptional<string>;
  declare question: string;
  declare options: string[];
  declare correctIndex: number | null;
  declare pairs: CreationOptional<{ left: string; right: string }[]>;
  declare sentenceParts: CreationOptional<string[]>;
  declare correctSentence: CreationOptional<string>;
  declare investigationSteps: CreationOptional<string[]>;
  declare correctOrder: CreationOptional<number[]>;
  declare explanation: string;
  declare difficulty: 1 | 2 | 3 | 4 | 5;
  declare xpReward: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initQuestion(sequelize: Sequelize): void {
  Question.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      lessonId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "lessons", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        field: "lesson_id",
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      correctIndex: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "correct_index",
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "mcq",
      },
      pairs: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      sentenceParts: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "sentence_parts",
      },
      correctSentence: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "correct_sentence",
      },
      investigationSteps: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "investigation_steps",
      },
      correctOrder: {
        type: DataTypes.JSONB,
        allowNull: true,
        field: "correct_order",
      },
      explanation: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
      xpReward: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        field: "xp_reward",
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
      tableName: "questions",
    }
  );
}
