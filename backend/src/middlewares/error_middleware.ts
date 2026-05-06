// backend/src/middlewares/error.middleware.ts
import type { Request, Response, NextFunction } from "express";

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

	console.error("Unexpected error:", err);
	return res.status(500).json({
		error: "Internal Server Error",
		statusCode: 500,
	});
}
