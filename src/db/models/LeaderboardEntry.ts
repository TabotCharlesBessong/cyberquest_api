import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { User } from "./User";

export class LeaderboardEntry extends Model<
  InferAttributes<LeaderboardEntry>,
  InferCreationAttributes<LeaderboardEntry>
> {
  declare id: CreationOptional<string>;
  declare userId: string;
  declare scope: "class" | "school" | "global";
  declare score: number;
  declare rank: CreationOptional<number>;
  declare seasonId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initLeaderboardEntry(sequelize: Sequelize): void {
  LeaderboardEntry.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
      },
      scope: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "scope",
      },
      seasonId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "season_id",
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName: "leaderboard_entries",
      indexes: [
        { fields: ["scope", "season_id", "score"] },
        { fields: ["user_id", "scope", "season_id"] },
      ],
    }
  );
}

export function associateLeaderboardEntry() {
  LeaderboardEntry.belongsTo(User, { foreignKey: "userId", as: "user" });
  User.hasMany(LeaderboardEntry, { foreignKey: "userId", as: "leaderboardEntries" });
}
