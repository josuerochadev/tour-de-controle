import type { Request, Response } from "express";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/cash_register_model";

/**
 * Opens a new cash register for the authenticated user.
 * @param req - Express request with authenticated user context
 * @param res - Express response
 * @returns JSON with the newly created cash register (201)
 * @throws {ApiError} 401 if user not authenticated
 */
export async function create(req: Request, res: Response) {
	const userId = req.user?.userId;
	if (!userId) {
		throw new ApiError("User not authenticated", 401);
	}

	const newRegister = await model.create(userId);
	return res.status(201).json(newRegister);
}

/**
 * Closes a cash register, comparing physical and theoretical amounts.
 * @param req - Express request with id route param and closing funds in body
 * @param res - Express response
 * @returns JSON with closed cash register and gap status
 * @throws {ApiError} 401 if user not authenticated
 */
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

/**
 * Retrieves all currently open cash registers.
 * @param req - Express request
 * @param res - Express response
 * @returns JSON array of open cash registers
 */
export async function current(req: Request, res: Response) {
	const cashRegisters = await model.current();
	return res.json(cashRegisters);
}
