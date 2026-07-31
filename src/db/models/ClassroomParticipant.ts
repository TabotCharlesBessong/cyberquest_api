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
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
      },
    },
    {
      sequelize,
      tableName: "classroom_participants",
    }
  );
}

export function associateClassroomParticipant() {
  // associations defined in db/index.ts after all models are imported
}
