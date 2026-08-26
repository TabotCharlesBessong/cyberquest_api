import { Sequelize } from "sequelize";
import config from "../config/config";
import { sequelize } from '../db';

async function ensureTestDatabase() {
  if (config.database.url) return;

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
      'SELECT 1 FROM pg_database WHERE datname = :name',
      { replacements: { name: config.database.name } }
    );
    if (Array.isArray(rows) && rows.length === 0) {
      await admin.query(`CREATE DATABASE "${config.database.name}"`);
    }
  } finally {
    await admin.close();
  }
}

beforeAll(async () => {
  await ensureTestDatabase();
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});
