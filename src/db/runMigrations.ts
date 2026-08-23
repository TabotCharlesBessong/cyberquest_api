import { sequelize } from "./index";
import fs from "fs";
import path from "path";
import logger from "../utils/logger";

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

async function runMigrations(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info("Connected to database for migrations", { component: "migrations" });

    // Ensure we're using the public schema
    await sequelize.query('SET search_path TO public');

    // Ensure migrations tracking table exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const [executedRows] = await sequelize.query("SELECT name FROM migrations") as [any[], any];
    const executed = new Set(executedRows.map((r) => r.name));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));

    let ranCount = 0;
    for (const file of files) {
      if (executed.has(file)) {
        logger.info(`Skipping already executed migration: ${file}`, { component: "migrations" });
        continue;
      }

      const filePath = path.join(MIGRATIONS_DIR, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      logger.info(`Running migration: ${file}`, { component: "migrations" });

      try {
        // Split by semicolon and run each statement individually for better error reporting
        const statements = sql
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        for (const statement of statements) {
          try {
            await sequelize.query(statement);
          } catch (stmtErr) {
            logger.error(`Failed to execute statement in ${file}:`, {
              component: "migrations",
              statement: statement.substring(0, 200),
              error: stmtErr instanceof Error ? stmtErr.message : "Unknown error",
            });
            throw stmtErr;
          }
        }

        await sequelize.query("INSERT INTO migrations (name) VALUES (:name)", {
          replacements: { name: file },
        });

        logger.info(`Completed migration: ${file}`, { component: "migrations" });
        ranCount++;
      } catch (err) {
        logger.error(`Migration file failed: ${file}`, {
          component: "migrations",
          error: err instanceof Error ? err.message : "Unknown error",
          stack: err instanceof Error ? err.stack : undefined,
        });
        throw err;
      }
    }

    // Verify tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `) as [any[], any];
    
    const tableNames = tables.map((t) => t.table_name);
    logger.info(`Database tables found: ${tableNames.length}`, { 
      component: "migrations", 
      tables: tableNames 
    });

    if (ranCount === 0) {
      logger.info("No new migrations to run", { component: "migrations" });
    } else {
      logger.info(`Ran ${ranCount} migration(s) successfully`, { component: "migrations" });
    }
  } catch (err) {
    logger.error("Migration failed", {
      component: "migrations",
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

void runMigrations();
