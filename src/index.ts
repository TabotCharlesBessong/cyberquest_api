import { createApp } from "./app";
import { sequelize } from "./db";
import { ensureDatabase } from "./db/bootstrap";
import config from "./config/config";

async function start(): Promise<void> {
  try {
    await ensureDatabase();
    await sequelize.authenticate();
    console.log("[db] Connected to PostgreSQL");

    // Auto-sync pushes the model definitions straight to the database.
    await sequelize.sync({ alter: true });
    console.log("[db] Models synchronized");

    const app = createApp();
    app.listen(config.port, () => {
      console.log(`[server] CyberQuest API listening on port ${config.port}`);
    });
  } catch (err) {
    console.error("[server] Failed to start:", err);
    process.exit(1);
  }
}

void start();
