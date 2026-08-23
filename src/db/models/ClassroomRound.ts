import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export type RoundStatus = "waiting" | "active" | "finished";

export class ClassroomRound extends Model<
  InferAttributes<ClassroomRound>,
  InferCreationAttributes<ClassroomRound>
> {
  declare id: CreationOptional<string>;
  declare classroomId: string;
  declare status: RoundStatus;
  declare currentQuestionIndex: number;
  declare startedAt: CreationOptional<Date>;
  declare finishedAt: CreationOptional<Date>;
  declare createdAt: CreationOptional<Date>;
}

export function initClassroomRound(sequelize: Sequelize): void {
  ClassroomRound.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      classroomId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "classroom_id",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "waiting",
        field: "status",
      },
      currentQuestionIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "current_question_index",
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "started_at",
      },
      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "finished_at",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      tableName: "classroom_rounds",
    }
  );
}

export function associateClassroomRound() {
  // associations defined in db/index.ts after all models are imported
}
