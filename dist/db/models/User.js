"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.initUser = initUser;
exports.sanitizeUser = sanitizeUser;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User extends sequelize_1.Model {
}
exports.User = User;
function initUser(sequelize) {
    User.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        age: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            validate: { min: 0, max: 120 },
        },
        avatar: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        isVerified: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        verificationCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        verificationCodeExpires: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        resetPasswordCode: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordExpires: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        onboarded: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        xp: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        level: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        streak: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        hearts: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        gems: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        ageGroup: {
            type: sequelize_1.DataTypes.ENUM("A", "B"),
            allowNull: true,
        },
        role: {
            type: sequelize_1.DataTypes.ENUM("user", "admin"),
            allowNull: false,
            defaultValue: "user",
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: "users",
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcryptjs_1.default.hash(user.password, 10);
            },
            beforeUpdate: async (user) => {
                if (user.changed("password")) {
                    user.password = await bcryptjs_1.default.hash(user.password, 10);
                }
            },
        },
    });
    // Instance method bound after init
    User.prototype.comparePassword = function (candidate) {
        return bcryptjs_1.default.compare(candidate, this.password);
    };
}
// Helper to strip sensitive fields when returning a user to the client
function sanitizeUser(user) {
    const { password, verificationCode, verificationCodeExpires, resetPasswordCode, resetPasswordExpires, ...safe } = user.get({ plain: true });
    return safe;
}
//# sourceMappingURL=User.js.map