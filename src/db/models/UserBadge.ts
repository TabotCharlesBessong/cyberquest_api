import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./User";
import { Badge } from "./Badge";

export class UserBadge extends Model<
  InferAttributes<UserBadge>,
  InferCreationAttributes<UserBadge>
> {
  declare userId: string;
  declare badgeId: string;
  declare earnedAt: CreationOptional<Date>;
  declare progress: CreationOptional<number>;
}

export function initUserBadge(sequelize: Sequelize): void {
  UserBadge.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "user_id",
      },
      badgeId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "badge_id",
      },
      earnedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "earned_at",
      },
      progress: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
    },
    {
      sequelize,
      tableName: "user_badges",
      timestamps: false,
    }
  );
}

// Associations
export function associateUserBadge() {
  UserBadge.belongsTo(User, { foreignKey: "userId", as: "user" });
  UserBadge.belongsTo(Badge, { foreignKey: "badgeId", as: "badge" });
  User.hasMany(UserBadge, { foreignKey: "userId", as: "userBadges" });
  Badge.hasMany(UserBadge, { foreignKey: "badgeId", as: "userBadges" });
}
