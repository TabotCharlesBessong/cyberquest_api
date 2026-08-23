import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export class LessonChoice extends Model<
  InferAttributes<LessonChoice>,
  InferCreationAttributes<LessonChoice>
> {
  declare id: CreationOptional<string>;
  declare lessonId: ForeignKey<string>;
  declare position: number;
  declare text: string;
  declare feedback: string;
  declare consequence: "positive" | "negative" | "neutral";
  declare xpDelta: number | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initLessonChoice(sequelize: Sequelize): void {
  LessonChoice.init(
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
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      consequence: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "consequence",
      },
      xpDelta: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "xp_delta",
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
      tableName: "lesson_choices",
    }
  );
}
