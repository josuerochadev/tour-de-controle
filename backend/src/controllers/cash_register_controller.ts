// controllers/cash-register.controller.ts
import type { Request, Response } from "express";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/cash_register_model";
import { createSchema, closeSchema } from "../schemas/cash_register_schema";

interface AuthUser {
	userId: number;
	role: number;
}

export async function create(req: Request, res: Response) {
	const user = req.user as AuthUser | undefined;

	if (!user?.userId) {
		throw new ApiError("User not authenticated", 401);
	}

	const newRegister = await model.create(user.userId);
	return res.status(201).json(newRegister);
}

export async function close(req: Request, res: Response) {
	const validatedData = closeSchema.parse(req.body);
	const { id } = req.params;

	try {
		await model.close(Number(id), validatedData);
	} catch (error) {
		const err = error as Error;

		if (err.message === "Invalid funds") {
			throw new ApiError("Invalid funds", 400);
		}

		throw error;
	}

	return res.sendStatus(204);
}

export async function current(req: Request, res: Response) {
	const cashRegisters = await model.current();
	return res.json(cashRegisters);
}
