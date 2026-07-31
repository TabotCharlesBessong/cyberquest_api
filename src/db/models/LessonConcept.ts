import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export class LessonConcept extends Model<
  InferAttributes<LessonConcept>,
  InferCreationAttributes<LessonConcept>
> {
  declare lessonId: ForeignKey<string>;
  declare conceptId: ForeignKey<string>;
  declare createdAt: CreationOptional<Date>;
}

export function initLessonConcept(sequelize: Sequelize): void {
  LessonConcept.init(
    {
      lessonId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "lessons", key: "id" },
        onDelete: "CASCADE",
      },
      conceptId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "concepts", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "lesson_concepts",
      timestamps: true,
      updatedAt: false,
    }
  );
}
