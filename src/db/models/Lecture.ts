import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class Lecture extends Model<
  InferAttributes<Lecture>,
  InferCreationAttributes<Lecture>
> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare title: string;
  declare subtitle: string;
  declare icon: string;
  declare color: string;
  declare badge: string;
  declare badgeName: string;
  declare order: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initLecture(sequelize: Sequelize): void {
  Lecture.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "📘",
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#4D96FF",
      },
      badge: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "⭐",
      },
      badgeName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: "lectures",
    }
  );
}
