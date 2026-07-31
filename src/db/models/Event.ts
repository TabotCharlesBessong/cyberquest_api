import {
  DataTypes,
  Model,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";

export class Event extends Model<
  InferAttributes<Event>,
  InferCreationAttributes<Event>
> {
  declare id: CreationOptional<string>;
  declare key: string;
  declare name: string;
  declare description: string;
  declare multiplier: number;
  declare startsAt: Date;
  declare endsAt: Date;
  declare createdAt: CreationOptional<Date>;
}

export function initEvent(sequelize: Sequelize): void {
  Event.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0,
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
      tableName: "events",
    }
  );
}
