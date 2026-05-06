// backend/src/models/auth.model.ts
import pool from "../config/db";
import { ApiError } from "../middlewares/error_middleware";

export async function findByEmail(email: string) {
	try {
		const result = await pool.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		return result.rows[0];
	} catch (error) {
		throw new ApiError("Database error during user lookup", 500);
	}
}

export async function findById(id: number) {
	const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
		id,
	]);
	return result.rows[0];
}

export async function saveResetToken(email: string, token: string) {
	await pool.query("UPDATE users SET reset_token = $1 WHERE email = $2", [
		token,
		email,
	]);
}

export async function updatePasswordByEmail(
	email: string,
	hashedPassword: string,
) {
	await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
		hashedPassword,
		email,
	]);
}
