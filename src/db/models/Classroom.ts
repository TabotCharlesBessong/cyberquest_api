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
   declare teacherId: CreationOptional<string>;
   declare memberIds: CreationOptional<string[]>;
   declare code: string;
   declare description: CreationOptional<string>;
   declare createdAt: CreationOptional<Date>;
   declare updatedAt: CreationOptional<Date>;
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
      teacherId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "teacher_id",
      },
      memberIds: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: [],
        field: "member_ids",
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "description",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "updated_at",
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
