import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class Quest extends Model<
  InferAttributes<Quest>,
  InferCreationAttributes<Quest>
> {
  declare id: CreationOptional<string>;
  declare key: string;
  declare type: "daily" | "weekly" | "special";
  declare title: string;
  declare description: string;
  declare target: number;
  declare xpReward: number;
  declare gemsReward: number;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initQuest(sequelize: Sequelize): void {
  Quest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM("daily", "weekly", "special"),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      target: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      xpReward: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gemsReward: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
      tableName: "quests",
    }
  );
}
