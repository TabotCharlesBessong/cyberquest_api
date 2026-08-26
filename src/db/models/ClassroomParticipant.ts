import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class ClassroomParticipant extends Model<
  InferAttributes<ClassroomParticipant>,
  InferCreationAttributes<ClassroomParticipant>
> {
  declare roundId: string;
  declare userId: string;
  declare score: number;
  declare joinedAt: CreationOptional<Date>;
}

export function initClassroomParticipant(sequelize: Sequelize): void {
  ClassroomParticipant.init(
    {
      roundId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "round_id",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "user_id",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      joinedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "joined_at",
      },
    },
    {
      sequelize,
      tableName: "classroom_participants",
      timestamps: false,
    }
  );
}

export function associateClassroomParticipant() {
  // associations defined in db/index.ts after all models are imported
}
