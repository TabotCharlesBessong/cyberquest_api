import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./User";

export class Classroom extends Model<
  InferAttributes<Classroom>,
  InferCreationAttributes<Classroom>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare school: string;
  declare teacherId: CreationOptional<string>;
  declare memberIds: CreationOptional<string[]>;
  declare code: string;
  declare createdAt: CreationOptional<Date>;
}

export function initClassroom(sequelize: Sequelize): void {
  Classroom.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      school: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      teacherId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      memberIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "classrooms",
      indexes: [{ fields: ["code"], unique: true }],
    }
  );
}

export function associateClassroom() {
  // associations defined in db/index.ts after all models are imported
}
