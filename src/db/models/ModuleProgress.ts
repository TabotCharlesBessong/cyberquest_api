import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";

export class ModuleProgress extends Model<
  InferAttributes<ModuleProgress>,
  InferCreationAttributes<ModuleProgress>
> {
  declare id: CreationOptional<string>;
  declare userId: ForeignKey<string>;
  declare lectureId: ForeignKey<string>;
  declare status: "not_started" | "in_progress" | "completed";
  declare score: number | null;
  declare stars: 0 | 1 | 2 | 3;
  declare xpEarned: number;
  declare completedAt: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initModuleProgress(sequelize: Sequelize): void {
  ModuleProgress.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
        field: "user_id",
      },
      lectureId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "lectures", key: "id" },
        onDelete: "CASCADE",
        field: "lecture_id",
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "not_started",
        field: "status",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      xpEarned: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "xp_earned",
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "completed_at",
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
      tableName: "module_progress",
    }
  );
}
