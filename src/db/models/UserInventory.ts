import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./User";
import { ShopItem } from "./ShopItem";

export class UserInventory extends Model<
  InferAttributes<UserInventory>,
  InferCreationAttributes<UserInventory>
> {
  declare userId: string;
  declare shopItemId: string;
  declare quantity: CreationOptional<number>;
  declare purchasedAt: CreationOptional<Date>;
  declare equipped: CreationOptional<boolean>;
}

export function initUserInventory(sequelize: Sequelize): void {
  UserInventory.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      shopItemId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      purchasedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      equipped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      tableName: "user_inventory",
    }
  );
}

// Associations
export function associateUserInventory() {
  UserInventory.belongsTo(User, { foreignKey: "userId", as: "user" });
  UserInventory.belongsTo(ShopItem, { foreignKey: "shopItemId", as: "shopItem" });
  User.hasMany(UserInventory, { foreignKey: "userId", as: "inventory" });
  ShopItem.hasMany(UserInventory, { foreignKey: "shopItemId", as: "inventory" });
}
