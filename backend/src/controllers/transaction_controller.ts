// controllers/transaction.controller.ts
import type { Request, Response } from "express";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/transaction_model";
import { filterSchema } from "../schemas/transaction_schema";

/**
 * Retrieves all transactions based on provided filters.
 *
 * @param req - The request object containing query parameters for filtering.
 * @param res - The response object used to send back the transactions.
 * @returns The filtered transactions as a JSON response.
 */
export async function getAll(req: Request, res: Response) {
	const filters = filterSchema.parse(req.query);
	const result = await model.findAll(filters);
	return res.json(result);
}

/**
 * Retrieves a transaction by its ID.
 *
 * @param req - The request object containing the transaction ID in the parameters.
 * @param res - The response object used to send back the transaction.
 * @throws {ApiError} If the ID is invalid or the transaction is not found.
 * @returns The transaction as a JSON response.
 */
export async function getById(req: Request, res: Response) {
	const transaction = await model.findById(Number(req.params.id));
	if (!transaction) {
		throw new ApiError("Not found", 404);
	}
	return res.json(transaction);
}

/**
 * Creates a new transaction.
 *
 * @param req - The request object containing the transaction data in the body.
 * @param res - The response object used to send back the created transaction.
 * @returns The created transaction as a JSON response.
 */
export async function create(req: Request, res: Response) {
	const newTransaction = await model.create(req.body);
	return res.status(201).json(newTransaction);
}

/**
 * Updates a transaction by its ID.
 *
 * @param req - The request object containing the transaction ID in the parameters and the update data in the body.
 * @param res - The response object used to send back the updated transaction.
 * @throws {ApiError} If the ID is invalid or the transaction is not found.
 * @returns The updated transaction as a JSON response.
 */
export async function updateById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const validatedData = req.body;

	const currentTransaction = await model.findById(id);
	if (!currentTransaction) {
		throw new ApiError("Transaction not found", 404);
	}

	// Combine current data with the updated data
	const updatedData = {
		amount: validatedData.amount ?? currentTransaction.amount,
		tip: validatedData.tip ?? currentTransaction.tip,
		id_cash_register:
			validatedData.id_cash_register ?? currentTransaction.id_cash_register,
		id_payment_type:
			validatedData.id_payment_type ?? currentTransaction.id_payment_type,
		id_user: currentTransaction.id_user, // Do not modify the creator
	};

	const updatedTransaction = await model.update(id, updatedData);
	return res.json(updatedTransaction);
}

/**
 * Deletes a transaction by its ID.
 *
 * @param req - The request object containing the transaction ID in the parameters.
 * @param res - The response object used to send back the status.
 * @throws {ApiError} If the ID is invalid or the transaction is not found.
 * @returns A 204 No Content status.
 */
export async function deleteById(req: Request, res: Response) {
	const id = Number(req.params.id);

	const transaction = await model.findById(id);
	if (!transaction) {
		throw new ApiError("Not found", 404);
	}

	await model.remove(id);
	return res.sendStatus(204);
}
