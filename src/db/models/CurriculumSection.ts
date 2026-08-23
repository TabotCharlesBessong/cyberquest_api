import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class CurriculumSection extends Model<
  InferAttributes<CurriculumSection>,
  InferCreationAttributes<CurriculumSection>
> {
  declare id: CreationOptional<string>;
  declare slug: string;
  declare title: string;
  declare description: string;
  declare icon: string;
  declare color: string;
  declare order: number;
  declare ageGroup: "A" | "B";
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initCurriculumSection(sequelize: Sequelize): void {
  CurriculumSection.init(
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
      description: {
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
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ageGroup: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "curriculum_sections",
    }
  );
}
