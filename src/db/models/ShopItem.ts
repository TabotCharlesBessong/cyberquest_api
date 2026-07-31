import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class ShopItem extends Model<
  InferAttributes<ShopItem>,
  InferCreationAttributes<ShopItem>
> {
  declare id: CreationOptional<string>;
  declare key: string;
  declare name: string;
  declare description: string;
  declare type: "avatar" | "powerup" | "consumable";
  declare cost: number;
  declare costType: "gems" | "xp";
  declare effect: string | null;
  declare icon: string;
  declare rarity: CreationOptional<"common" | "rare" | "epic" | "legendary">;
  declare stock: CreationOptional<number | null>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initShopItem(sequelize: Sequelize): void {
  ShopItem.init(
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
      type: {
        type: DataTypes.ENUM("avatar", "powerup", "consumable"),
        allowNull: false,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      costType: {
        type: DataTypes.ENUM("gems", "xp"),
        allowNull: false,
        defaultValue: "gems",
      },
      effect: {
        type: DataTypes.JSONB,
        allowNull: true,
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
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      tableName: "shop_items",
    }
  );
}
