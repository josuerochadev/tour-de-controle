import type { NextFunction, Request, Response } from "express";
import { ApiError } from "./error_middleware";

export function validateIdParam(paramName = "id") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const value = req.params[paramName];
    if (!value || Number.isNaN(Number(value))) {
      throw new ApiError(`Invalid ${paramName}`, 400);
    }
    next();
  };
}
