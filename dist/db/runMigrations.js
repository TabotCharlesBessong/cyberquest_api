"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const MIGRATIONS_DIR = path_1.default.join(__dirname, "migrations");
async function runMigrations() {
    try {
        await index_1.sequelize.authenticate();
        logger_1.default.info("Connected to database for migrations", { component: "migrations" });
        // Ensure we're using the public schema
        await index_1.sequelize.query('SET search_path TO public');
        // Ensure migrations tracking table exists
        await index_1.sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);
        const [executedRows] = await index_1.sequelize.query("SELECT name FROM migrations");
        const executed = new Set(executedRows.map((r) => r.name));
        const files = fs_1.default
            .readdirSync(MIGRATIONS_DIR)
            .filter((f) => f.endsWith(".sql"))
            .sort((a, b) => a.localeCompare(b));
        let ranCount = 0;
        for (const file of files) {
            if (executed.has(file)) {
                logger_1.default.info(`Skipping already executed migration: ${file}`, { component: "migrations" });
                continue;
            }
            const filePath = path_1.default.join(MIGRATIONS_DIR, file);
            const sql = fs_1.default.readFileSync(filePath, "utf-8");
            logger_1.default.info(`Running migration: ${file}`, { component: "migrations" });
            try {
                // Split by semicolon and run each statement individually for better error reporting
                const statements = sql
                    .split(";")
                    .map((s) => s.trim())
                    .filter((s) => s.length > 0);
                for (const statement of statements) {
                    try {
                        await index_1.sequelize.query(statement);
                    }
                    catch (stmtErr) {
                        logger_1.default.error(`Failed to execute statement in ${file}:`, {
                            component: "migrations",
                            statement: statement.substring(0, 200),
                            error: stmtErr instanceof Error ? stmtErr.message : "Unknown error",
                        });
                        throw stmtErr;
                    }
                }
                await index_1.sequelize.query("INSERT INTO migrations (name) VALUES (:name)", {
                    replacements: { name: file },
                });
                logger_1.default.info(`Completed migration: ${file}`, { component: "migrations" });
                ranCount++;
            }
            catch (err) {
                logger_1.default.error(`Migration file failed: ${file}`, {
                    component: "migrations",
                    error: err instanceof Error ? err.message : "Unknown error",
                    stack: err instanceof Error ? err.stack : undefined,
                });
                throw err;
            }
        }
        // Verify tables exist
        const [tables] = await index_1.sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
        const tableNames = tables.map((t) => t.table_name);
        logger_1.default.info(`Database tables found: ${tableNames.length}`, {
            component: "migrations",
            tables: tableNames
        });
        if (ranCount === 0) {
            logger_1.default.info("No new migrations to run", { component: "migrations" });
        }
        else {
            logger_1.default.info(`Ran ${ranCount} migration(s) successfully`, { component: "migrations" });
        }
    }
    catch (err) {
        logger_1.default.error("Migration failed", {
            component: "migrations",
            error: err instanceof Error ? err.message : "Unknown error",
            stack: err instanceof Error ? err.stack : undefined,
        });
        process.exit(1);
    }
    finally {
        await index_1.sequelize.close();
    }
}
void runMigrations();
//# sourceMappingURL=runMigrations.js.map