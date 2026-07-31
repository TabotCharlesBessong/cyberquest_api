import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./User";
import { Quest } from "./Quest";

export class UserQuest extends Model<
  InferAttributes<UserQuest>,
  InferCreationAttributes<UserQuest>
> {
  declare userId: string;
  declare questId: string;
  declare status: CreationOptional<"active" | "completed" | "claimed" | "expired">;
  declare progress: CreationOptional<number>;
  declare claimedAt: Date | null;
  declare expiresAt: Date | null;
}

export function initUserQuest(sequelize: Sequelize): void {
  UserQuest.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      questId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM("active", "completed", "claimed", "expired"),
        allowNull: false,
        defaultValue: "active",
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      claimedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "user_quests",
    }
  );
}

// Associations
export function associateUserQuest() {
  UserQuest.belongsTo(User, { foreignKey: "userId", as: "user" });
  UserQuest.belongsTo(Quest, { foreignKey: "questId", as: "quest" });
  User.hasMany(UserQuest, { foreignKey: "userId", as: "userQuests" });
  Quest.hasMany(UserQuest, { foreignKey: "questId", as: "userQuests" });
}
