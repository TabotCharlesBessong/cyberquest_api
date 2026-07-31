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
  declare question: string;
  declare options: string[];
  declare correctIndex: number;
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
        allowNull: false,
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
      tableName: "questions",
    }
  );
}
