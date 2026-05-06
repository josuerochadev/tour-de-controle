// backend/src/models/user.model.ts
import pool from "../config/db";
import { ApiError } from "../middlewares/error_middleware";

export interface User {
	id_user: number;
	first_name: string;
	last_name: string;
	email: string;
	password: string;
	postal_address?: string;
	phone_number?: string;
	hire_date?: string;
	is_active?: boolean;
	id_role: number;
}

export const findAll = async (): Promise<User[]> => {
	const result = await pool.query("SELECT * FROM users");
	return result.rows;
};

export const findById = async (id: number): Promise<User | null> => {
	try {
		const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
			id,
		]);
		return result.rows[0] || null;
	} catch (error) {
		throw new ApiError("Database error during user lookup", 500);
	}
};

export const create = async (user: Partial<User>): Promise<User> => {
	const {
		first_name,
		last_name,
		email,
		password,
		postal_address,
		phone_number,
		hire_date,
		id_role,
	} = user;
	const result = await pool.query(
		`INSERT INTO users (first_name, last_name, email, password, postal_address, phone_number, hire_date, id_role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
		[
			first_name,
			last_name,
			email,
			password,
			postal_address,
			phone_number,
			hire_date,
			id_role,
		],
	);
	return result.rows[0];
};

export const update = async (
	id: number,
	user: Partial<User>,
): Promise<User> => {
	const {
		first_name,
		last_name,
		email,
		password,
		postal_address,
		phone_number,
		hire_date,
		id_role,
	} = user;

	const result = await pool.query(
		`UPDATE users SET
		first_name = COALESCE($1, first_name),
		last_name = COALESCE($2, last_name),
		email = COALESCE($3, email),
		password = COALESCE($4, password),
		postal_address = COALESCE($5, postal_address),
		phone_number = COALESCE($6, phone_number),
		hire_date = COALESCE($7, hire_date),
		id_role = COALESCE($8, id_role)
	  WHERE id_user = $9
	  RETURNING *`,
		[
			first_name,
			last_name,
			email,
			password,
			postal_address,
			phone_number,
			hire_date,
			id_role,
			id,
		],
	);
	return result.rows[0];
};

export const remove = async (id: number): Promise<void> => {
	await pool.query("DELETE FROM users WHERE id_user = $1", [id]);
};
