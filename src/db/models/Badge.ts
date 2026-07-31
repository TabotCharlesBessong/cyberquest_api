import {
  DataTypes,
  Model,
  Optional,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class Badge extends Model<
  InferAttributes<Badge>,
  InferCreationAttributes<Badge>
> {
  declare id: CreationOptional<string>;
  declare key: string;
  declare name: string;
  declare description: string;
  declare icon: string;
  declare rarity: CreationOptional<"common" | "rare" | "epic" | "legendary">;
  declare criteria: string;
  declare xpReward: number;
  declare gemsReward: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initBadge(sequelize: Sequelize): void {
  Badge.init(
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rarity: {
        type: DataTypes.ENUM("common", "rare", "epic", "legendary"),
        allowNull: false,
        defaultValue: "common",
      },
      criteria: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: "badges",
    }
  );
}
