// backend/src/models/auth.model.ts
import pool from "../config/db";

/**
 * Finds a user by their email address.
 * @param email - The email to search for
 * @returns The user row, or undefined if not found
 */
export async function findByEmail(email: string) {
	const result = await pool.query("SELECT * FROM users WHERE email = $1", [
		email,
	]);
	return result.rows[0];
}

/**
 * Finds a user by their ID.
 * @param id - The user ID
 * @returns The user row, or undefined if not found
 */
export async function findById(id: number) {
	const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
		id,
	]);
	return result.rows[0];
}

/**
 * Saves (or clears) a password reset token for a user.
 * @param email - The user's email
 * @param token - The reset token (empty string to clear)
 */
export async function saveResetToken(email: string, token: string) {
	await pool.query("UPDATE users SET reset_token = $1 WHERE email = $2", [
		token,
		email,
	]);
}

/**
 * Updates a user's password by email.
 * @param email - The user's email
 * @param hashedPassword - The new bcrypt-hashed password
 */
export async function updatePasswordByEmail(
	email: string,
	hashedPassword: string,
) {
	await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
		hashedPassword,
		email,
	]);
}
