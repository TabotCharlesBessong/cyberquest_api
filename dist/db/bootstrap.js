"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDatabase = ensureDatabase;
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../utils/logger"));
async function ensureDatabase() {
    if (config_1.default.primaryDb === "supabase") {
        logger_1.default.info("Using Supabase — skipping database creation", { component: "db" });
        return;
    }
    const admin = new sequelize_1.Sequelize("postgres", config_1.default.database.user || "postgres", config_1.default.database.password || "postgres", {
        host: config_1.default.database.host || "localhost",
        port: config_1.default.database.port || 5432,
        dialect: "postgres",
        logging: false,
    });
    try {
        const [rows] = await admin.query("SELECT 1 FROM pg_database WHERE datname = :name", { replacements: { name: config_1.default.database.name } });
        if (Array.isArray(rows) && rows.length === 0) {
            await admin.query(`CREATE DATABASE "${config_1.default.database.name}"`);
            logger_1.default.info(`Database created: ${config_1.default.database.name}`, { component: "db" });
        }
        else {
            logger_1.default.info(`Database already exists: ${config_1.default.database.name}`, { component: "db" });
        }
    }
    finally {
        await admin.close();
    }
}
//# sourceMappingURL=bootstrap.js.map