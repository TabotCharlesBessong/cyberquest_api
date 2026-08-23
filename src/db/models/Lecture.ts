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
  declare ageGroup: CreationOptional<"A" | "B">;
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
        field: "badge_name",
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ageGroup: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "age_group",
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
      tableName: "lectures",
    }
  );
}
