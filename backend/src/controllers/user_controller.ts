// backend/src/controllers/user.controller.ts
import type { Request, Response } from "express";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/user_model";
import { hashPassword } from "../utils/password_utils";
import { DEFAULT_PAGE_LIMIT } from "../config/constants";

/**
 * Retrieves a paginated list of all users.
 * @param req - Express request with optional page and limit query params
 * @param res - Express response
 * @returns JSON with paginated user data
 */
export async function getAll(req: Request, res: Response) {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || DEFAULT_PAGE_LIMIT;
	const result = await model.findAll(page, limit);
	return res.json(result);
}

/**
 * Retrieves a single user by ID.
 * @param req - Express request with id route param
 * @param res - Express response
 * @returns JSON user object
 * @throws {ApiError} 404 if user not found
 */
export async function getById(req: Request, res: Response) {
	const user = await model.findById(Number(req.params.id));
	if (!user) {
		throw new ApiError("User not found", 404);
	}
	return res.json(user);
}

/**
 * Creates a new user with a hashed password.
 * @param req - Express request with user data in body
 * @param res - Express response
 * @returns JSON with the newly created user (201)
 */
export async function create(req: Request, res: Response) {
	const validatedData = req.body;
	// Hash the password
	const hashedPassword = await hashPassword(validatedData.password);
	// Insert the new user
	const newUser = await model.create({
		...validatedData,
		password: hashedPassword,
	});

	return res.status(201).json(newUser);
}

/**
 * Partially updates an existing user. Hashes the password if provided.
 * @param req - Express request with id route param and partial user data in body
 * @param res - Express response
 * @returns JSON with the updated user
 * @throws {ApiError} 404 if user not found
 */
export async function update(req: Request, res: Response) {
	const id = Number(req.params.id);
	const validatedData = req.body;

	const existingUser = await model.findById(id);
	if (!existingUser) {
		throw new ApiError("User not found", 404);
	}

	// Prepare the updated data
	const patchedData = { ...existingUser, ...validatedData };

	// If patching the password, hash it
	if (validatedData.password) {
		patchedData.password = await hashPassword(validatedData.password);
	}

	const updated = await model.update(id, patchedData);
	return res.json(updated);
}

/**
 * Deletes a user by ID.
 * @param req - Express request with id route param
 * @param res - Express response
 * @returns 204 No Content on success
 * @throws {ApiError} 404 if user not found
 */
export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);

	const user = await model.findById(id);
	if (!user) {
		throw new ApiError("User not found", 404);
	}

	await model.remove(id);
	return res.sendStatus(204);
}

/**
 * Returns the authenticated user's profile (name and email).
 * @param req - Express request with authenticated user context
 * @param res - Express response
 * @returns JSON with first_name, last_name, and email
 * @throws {ApiError} 400 if not authenticated, 404 if user not found
 */
export async function getProfile(req: Request, res: Response) {
	const userId = req.user?.userId; // Récupérer l'ID utilisateur depuis le token JWT

	if (!userId) {
		throw new ApiError("Not authenticated", 400);
	}

	const user = await model.findById(userId);

	if (!user) {
		throw new ApiError("User not found", 404);
	}

	return res.json({
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
	});
}
