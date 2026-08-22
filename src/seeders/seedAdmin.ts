import "dotenv/config";
import { sequelize, User } from "../db";
import logger from "../utils/logger";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@cyberquest.app";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function seedAdmin(): Promise<void> {
  try {
    await sequelize.authenticate();
    logger.info("Connected to PostgreSQL", { component: "seedAdmin" });

    await sequelize.sync({ alter: true });
    logger.info("Models synchronized", { component: "seedAdmin" });

    const [admin] = await User.findOrCreate({
      where: { email: ADMIN_EMAIL },
      defaults: {
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        age: 30,
        ageGroup: "B",
        avatar: "👑",
        xp: 0,
        level: 1,
        streak: 0,
        hearts: 5,
        gems: 100,
        onboarded: true,
        isVerified: true,
        role: "admin",
      },
    });

    const needsUpdate =
      admin.name !== ADMIN_NAME ||
      admin.role !== "admin" ||
      !(await admin.comparePassword(ADMIN_PASSWORD));

    if (needsUpdate) {
      await admin.update({
        password: ADMIN_PASSWORD,
        name: ADMIN_NAME,
        role: "admin",
      });
    }

    logger.info("Admin user ensured", {
      component: "seedAdmin",
      email: ADMIN_EMAIL,
      userId: admin.id,
    });
  } catch (err) {
    logger.error("Admin seed failed", {
      component: "seedAdmin",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

void seedAdmin();
