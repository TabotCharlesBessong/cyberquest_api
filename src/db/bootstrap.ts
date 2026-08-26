import { Sequelize } from "sequelize";
import config from "../config/config";
import logger from "../utils/logger";

export async function ensureDatabase(): Promise<void> {
  if (config.isCloudDb) {
    logger.info("Using Supabase — skipping database creation", { component: "db" });
    return;
  }

  const admin = new Sequelize(
    "postgres",
    config.database.user || "postgres",
    config.database.password || "postgres",
    {
      host: config.database.host || "localhost",
      port: config.database.port || 5432,
      dialect: "postgres",
      logging: false,
    }
  );

  try {
    const [rows] = await admin.query(
      "SELECT 1 FROM pg_database WHERE datname = :name",
      { replacements: { name: config.database.name } }
    );

    if (Array.isArray(rows) && rows.length === 0) {
      await admin.query(`CREATE DATABASE "${config.database.name}"`);
      logger.info(`Database created: ${config.database.name}`, { component: "db" });
    } else {
      logger.info(`Database already exists: ${config.database.name}`, { component: "db" });
    }
  } finally {
    await admin.close();
  }
}
