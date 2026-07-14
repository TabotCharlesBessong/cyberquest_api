import { Sequelize } from "sequelize";
import config from "../config/config";

/**
 * Connects to the PostgreSQL *maintenance* database (`postgres`) using Sequelize
 * and creates the target application database if it does not already exist. This
 * lets the app bootstrap a fresh environment from just the connection credentials.
 */
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
      console.log(`[db] Created database "${config.database.name}"`);
    } else {
      console.log(`[db] Database "${config.database.name}" already exists`);
    }
  } finally {
    await admin.close();
  }
}
