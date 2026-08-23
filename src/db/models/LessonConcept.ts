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
        onUpdate: "CASCADE",
        field: "lesson_id",
      },
      conceptId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "concepts", key: "id" },
        onDelete: "CASCADE",
        field: "concept_id",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
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
