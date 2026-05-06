import type { Request, Response } from "express";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/cash_register_model";

export async function create(req: Request, res: Response) {
	const userId = req.user?.userId;
	if (!userId) {
		throw new ApiError("User not authenticated", 401);
	}

	const newRegister = await model.create(userId);
	return res.status(201).json(newRegister);
}

export async function close(req: Request, res: Response) {
	const validatedData = req.body;
	const { id } = req.params;
	const userId = req.user?.userId;

	if (!userId) {
		throw new ApiError("User not authenticated", 401);
	}

	const { cashRegister, hasGap } = await model.close(Number(id), validatedData, userId);

	if (hasGap) {
		return res.status(200).json({
			message: "Caisse fermée avec un écart détecté",
			cashRegister,
			hasGap: true,
		});
	}

	return res.status(200).json({
		message: "Caisse fermée avec succès",
		cashRegister,
		hasGap: false,
	});
}

export async function current(req: Request, res: Response) {
	const cashRegisters = await model.current();
	return res.json(cashRegisters);
}
