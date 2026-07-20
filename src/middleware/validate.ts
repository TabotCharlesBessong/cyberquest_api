import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { badRequest } from "../utils/apiError";

type Schema = z.ZodType<unknown>;

export function validateBody(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body ?? {});
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return next(badRequest(err.issues.map(i => i.message).join(", ")));
      }
      next(err);
    }
  };
}

export function validateParams(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params) as Request["params"];
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return next(badRequest(err.issues.map(i => i.message).join(", ")));
      }
      next(err);
    }
  };
}

export function validateQuery(schema: Schema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as Request["query"];
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return next(badRequest(err.issues.map(i => i.message).join(", ")));
      }
      next(err);
    }
  };
}
