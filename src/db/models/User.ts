import {
  DataTypes,
  Model,
  Optional,
  Sequelize,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import bcrypt from "bcryptjs";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare age: number | null;
  declare avatar: string | null;
  declare isVerified: CreationOptional<boolean>;
  declare verificationCode: string | null;
  declare verificationCodeExpires: Date | null;
  declare resetPasswordCode: string | null;
  declare resetPasswordExpires: Date | null;
  declare onboarded: CreationOptional<boolean>;
  declare xp: CreationOptional<number>;
  declare level: CreationOptional<number>;
  declare streak: CreationOptional<number>;
  declare hearts: CreationOptional<number>;
  declare gems: CreationOptional<number>;
  declare ageGroup: CreationOptional<"A" | "B">;
  declare role: CreationOptional<"user" | "admin">;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare comparePassword: (candidate: string) => Promise<boolean>;
}

export function initUser(sequelize: Sequelize): void {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: { min: 0, max: 120 },
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationCodeExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      resetPasswordCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      onboarded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      streak: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      hearts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5,
      },
      gems: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ageGroup: {
        type: DataTypes.ENUM("A", "B"),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
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
      tableName: "users",
      hooks: {
        beforeCreate: async (user: User) => {
          user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user: User) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // Instance method bound after init
  User.prototype.comparePassword = function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
  };
}

// Helper to strip sensitive fields when returning a user to the client
export function sanitizeUser(user: User) {
  const { password, verificationCode, verificationCodeExpires, resetPasswordCode, resetPasswordExpires, ...safe } =
    user.get({ plain: true });
  return safe;
}
