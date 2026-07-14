import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";
import { unauthorized } from "../utils/apiError";

interface AuthPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export interface AuthedRequest extends Request {
  user?: AuthPayload;
}

export function authMiddleware(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(unauthorized("Authentication required"));
  }
  const token = header.split(" ")[1];
  try {
    const decoded = verifyToken(token) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    next(unauthorized("Invalid or expired token"));
  }
}
