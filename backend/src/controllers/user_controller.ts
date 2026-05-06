// backend/src/controllers/user.controller.ts
import type { Request, Response } from "express";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/user_model";
import { hashPassword } from "../utils/password_utils";
import { DEFAULT_PAGE_LIMIT } from "../config/constants";

// GET /api/users
export async function getAll(req: Request, res: Response) {
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || DEFAULT_PAGE_LIMIT;
	const result = await model.findAll(page, limit);
	return res.json(result);
}

// GET /api/users/:id
export async function getById(req: Request, res: Response) {
	const user = await model.findById(Number(req.params.id));
	if (!user) {
		throw new ApiError("User not found", 404);
	}
	return res.json(user);
}

// POST /api/users
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

// PATCH /api/users/:id
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

// DELETE /api/users/:id
export async function remove(req: Request, res: Response) {
	const id = Number(req.params.id);

	const user = await model.findById(id);
	if (!user) {
		throw new ApiError("User not found", 404);
	}

	await model.remove(id);
	return res.sendStatus(204);
}

export async function getProfile(req: Request, res: Response) {
	const userId = req.user?.userId; // Récupérer l'ID utilisateur depuis le token JWT

	if (!userId) {
		return res.status(400).json({ message: "Utilisateur non authentifié" });
	}

	const user = await model.findById(userId);

	if (!user) {
		return res.status(404).json({ message: "Utilisateur non trouvé" });
	}

	return res.json({
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
	});
}
