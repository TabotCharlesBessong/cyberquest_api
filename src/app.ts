import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import lectureRoutes from "./routes/lectureRoutes";
import progressRoutes from "./routes/progressRoutes";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import { specs } from "./config/swagger";
import swaggerUi from "swagger-ui-express";

// nodemon auto-restarts the server when files under src/ change.
export function createApp(): Application {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "CyberQuest API is up" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  app.use("/api/auth", authRoutes);
  app.use("/api/lectures", lectureRoutes);
  app.use("/api/progress", progressRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
