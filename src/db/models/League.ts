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
        type: DataTypes.ENUM("bronze", "silver", "gold", "diamond"),
        allowNull: false,
      },
      seasonId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startsAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endsAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
