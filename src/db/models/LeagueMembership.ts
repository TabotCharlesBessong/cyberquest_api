import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import { League } from "./League";
import { User } from "./User";

export class LeagueMembership extends Model<
  InferAttributes<LeagueMembership>,
  InferCreationAttributes<LeagueMembership>
> {
  declare leagueId: string;
  declare userId: string;
  declare xp: number;
  declare rank: CreationOptional<number>;
  declare promoted: CreationOptional<boolean>;
  declare demoted: CreationOptional<boolean>;
  declare changeNote: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initLeagueMembership(sequelize: Sequelize): void {
  LeagueMembership.init(
    {
      leagueId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "league_id",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        field: "user_id",
      },
      xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      promoted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      demoted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      changeNote: {
        type: DataTypes.STRING,
        allowNull: true,
        field: "change_note",
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
      tableName: "league_memberships",
      indexes: [{ fields: ["league_id", "xp"] }],
    }
  );
}

export function associateLeagueMembership() {
  // associations defined in db/index.ts after all models are imported
}
