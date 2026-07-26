import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import lectureRoutes from "./routes/lectureRoutes";
import progressRoutes from "./routes/progressRoutes";
import gamificationRoutes from "./routes/gamificationRoutes";
import shopRoutes from "./routes/shopRoutes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { specs } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:19006",
  "http://127.0.0.1:3000",
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
  app.use("/api/progress", progressRoutes);
  app.use("/api/gamification", gamificationRoutes);
  app.use("/api/shop", shopRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
