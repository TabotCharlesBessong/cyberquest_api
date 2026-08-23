import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export class LessonStandard extends Model<
  InferAttributes<LessonStandard>,
  InferCreationAttributes<LessonStandard>
> {
  declare lessonId: ForeignKey<string>;
  declare standardId: ForeignKey<string>;
  declare createdAt: CreationOptional<Date>;
}

export function initLessonStandard(sequelize: Sequelize): void {
  LessonStandard.init(
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
      standardId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: { model: "standards", key: "id" },
        onDelete: "CASCADE",
        field: "standard_id",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "created_at",
      },
    },
    {
      sequelize,
      tableName: "lesson_standards",
      timestamps: true,
      updatedAt: false,
    }
  );
}
