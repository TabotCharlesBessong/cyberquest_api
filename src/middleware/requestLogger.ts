import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers["user-agent"],
      ip: req.ip || req.connection.remoteAddress,
    };

    if (res.statusCode >= 500) {
      logger.error("HTTP request error", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("HTTP request warning", logData);
    } else {
      logger.info("HTTP request", logData);
    }
  });

  next();
}
