import { createApp } from "./app";
import { sequelize } from "./db";
import { ensureDatabase } from "./db/bootstrap";
import config from "./config/config";
import logger from "./utils/logger";

async function start(): Promise<void> {
  try {
    await ensureDatabase();
    await sequelize.authenticate();
    logger.info("Connected to PostgreSQL", { component: "db" });

    const app = createApp();
    app.listen(config.port, () => {
      logger.info(`CyberQuest API listening on port ${config.port}`, { component: "server" });
    });
  } catch (err) {
    logger.error("Failed to start server", {
      component: "server",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    process.exit(1);
  }
}

void start();
