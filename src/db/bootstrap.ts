import { Sequelize } from "sequelize";
import config from "../config/config";
import logger from "../utils/logger";

export async function ensureDatabase(): Promise<void> {
  const admin = new Sequelize(
    "postgres",
    config.database.user,
    config.database.password,
    {
      host: config.database.host,
      port: config.database.port,
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
