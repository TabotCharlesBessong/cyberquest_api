"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./db");
const bootstrap_1 = require("./db/bootstrap");
const config_1 = __importDefault(require("./config/config"));
const logger_1 = __importDefault(require("./utils/logger"));
async function start() {
    try {
        await (0, bootstrap_1.ensureDatabase)();
        await db_1.sequelize.authenticate();
        logger_1.default.info("Connected to PostgreSQL", { component: "db" });
        const app = (0, app_1.createApp)();
        app.listen(config_1.default.port, () => {
            logger_1.default.info(`CyberQuest API listening on port ${config_1.default.port}`, { component: "server" });
        });
    }
    catch (err) {
        logger_1.default.error("Failed to start server", {
            component: "server",
            error: err instanceof Error ? err.message : "Unknown error",
        });
        process.exit(1);
    }
}
void start();
//# sourceMappingURL=index.js.map