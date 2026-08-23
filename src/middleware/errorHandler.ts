import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

export function notFoundHandler(
  _req: Request,
  res: Response
): void {
  logger.warn("Route not found", { path: _req.path, method: _req.method });
  res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    logger.warn(`API Error: ${err.message}`, {
      component: "errorHandler",
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  logger.error("Internal server error", {
    component: "errorHandler",
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
