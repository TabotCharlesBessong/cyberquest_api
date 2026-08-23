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
        type: DataTypes.STRING,
        allowNull: false,
        field: "type",
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      costType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "gems",
        field: "cost_type",
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
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "common",
        field: "rarity",
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
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
      tableName: "shop_items",
    }
  );
}
