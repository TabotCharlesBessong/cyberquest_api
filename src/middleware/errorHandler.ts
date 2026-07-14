import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function notFoundHandler(
  _req: Request,
  res: Response
): void {
  res.status(404).json({ success: false, message: "Route not found" });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  console.error("[error]", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
