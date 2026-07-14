export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const badRequest = (msg: string) => new ApiError(400, msg);
export const unauthorized = (msg: string) => new ApiError(401, msg);
export const forbidden = (msg: string) => new ApiError(403, msg);
export const notFound = (msg: string) => new ApiError(404, msg);
