import type { NextFunction, Request, Response } from "express";
import logger from "../config/logger";
import { captureError } from "../config/monitoring";

/**
 * Custom error class for API errors with an HTTP status code and optional error code.
 */
export class ApiError extends Error {
  public statusCode: number;
  public code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

/**
 * Global Express error handler. Returns structured JSON for ApiError instances and 500 for unexpected errors.
 * @param err - The thrown error
 * @param req - Express request
 * @param res - Express response
 * @param _next - Next function (unused, required by Express error handler signature)
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
      code: err.code,
    });
  }

  const safeError =
    err instanceof Error
      ? { message: err.message, stack: err.stack }
      : String(err);
  captureError(err);
  logger.error("Unexpected error", {
    error: safeError,
    path: req.path,
    method: req.method,
  });
  return res.status(500).json({
    error: "Internal Server Error",
    statusCode: 500,
  });
}
