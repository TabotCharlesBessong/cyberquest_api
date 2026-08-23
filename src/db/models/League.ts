import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class League extends Model<
  InferAttributes<League>,
  InferCreationAttributes<League>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare tier: "bronze" | "silver" | "gold" | "diamond";
  declare seasonId: string;
  declare startsAt: Date;
  declare endsAt: Date;
  declare createdAt: CreationOptional<Date>;
}

export function initLeague(sequelize: Sequelize): void {
  League.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tier: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "tier",
      },
      seasonId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "season_id",
      },
      startsAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "starts_at",
      },
      endsAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "ends_at",
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
      },
    },
    {
      sequelize,
      tableName: "leagues",
      indexes: [{ fields: ["seasonId", "tier"] }],
    }
  );
}

export function associateLeague() {
  // associations defined in db/index.ts after both models are imported
}
