import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import lectureRoutes from "./routes/lectureRoutes";
import curriculumRoutes from "./routes/curriculumRoutes";
import adminCurriculumRoutes from "./routes/adminCurriculumRoutes";
import adminUnitRoutes from "./routes/adminUnitRoutes";
import adminLessonRoutes from "./routes/adminLessonRoutes";
import adminQuestionRoutes from "./routes/adminQuestionRoutes";
import adminImportExportRoutes from "./routes/adminImportExportRoutes";
import adminStatsRoutes from "./routes/adminStatsRoutes";
import adminUserRoutes from "./routes/adminUserRoutes";
import adminParentalRoutes from "./routes/adminParentalRoutes";
import progressRoutes from "./routes/progressRoutes";
import gamificationRoutes from "./routes/gamificationRoutes";
import shopRoutes from "./routes/shopRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import leagueRoutes from "./routes/leagueRoutes";
import classroomRoutes from "./routes/classroomRoutes";
import eventRoutes from "./routes/eventRoutes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { specs } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4000",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:19006",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:4000",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:19006",
  "http://127.0.0.1:5173",
];

export function createApp(): Application {
  const app = express();

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "CyberQuest API is up" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.use("/api/auth", authRoutes);
  app.use("/api/lectures", lectureRoutes);
  app.use("/api/curriculum", curriculumRoutes);
  app.use("/api/admin/curriculum", adminCurriculumRoutes);
  app.use("/api/admin/units", adminUnitRoutes);
  app.use("/api/admin/lessons", adminLessonRoutes);
  app.use("/api/admin/questions", adminQuestionRoutes);
  app.use("/api/admin/import-export", adminImportExportRoutes);
  app.use("/api/admin/stats", adminStatsRoutes);
  app.use("/api/admin/users", adminUserRoutes);
  app.use("/api/admin/parental-controls", adminParentalRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/gamification", gamificationRoutes);
  app.use("/api/shop", shopRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/leagues", leagueRoutes);
  app.use("/api/classroom", classroomRoutes);
  app.use("/api/events", eventRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
