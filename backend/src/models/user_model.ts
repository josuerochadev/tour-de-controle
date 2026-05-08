import { DEFAULT_PAGE_LIMIT } from "../config/constants";
import pool from "../config/db";

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

/**
 * Retrieves a paginated list of all users.
 * @param page - Page number (1-based)
 * @param limit - Maximum number of users per page
 * @returns Paginated result with user data and total count
 */
export const findAll = async (
  page = 1,
  limit = DEFAULT_PAGE_LIMIT,
): Promise<{ data: User[]; total: number; page: number; limit: number }> => {
  const countResult = await pool.query("SELECT COUNT(*) FROM users");
  const total = Number(countResult.rows[0].count);

  const offset = (page - 1) * limit;
  const result = await pool.query(
    "SELECT id_user, first_name, last_name, email, postal_address, phone_number, hire_date, is_active, id_role FROM users ORDER BY id_user ASC LIMIT $1 OFFSET $2",
    [limit, offset],
  );

  return { data: result.rows, total, page, limit };
};

/**
 * Finds a user by their ID.
 * @param id - The user ID
 * @returns The user object, or null if not found
 */
export const findById = async (id: number): Promise<User | null> => {
  const result = await pool.query(
    "SELECT id_user, first_name, last_name, email, postal_address, phone_number, hire_date, is_active, id_role FROM users WHERE id_user = $1",
    [id],
  );
  return result.rows[0] || null;
};

/**
 * Inserts a new user into the database.
 * @param user - Partial user object with required fields
 * @returns The newly created user
 */
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

/**
 * Updates an existing user using COALESCE to preserve unchanged fields.
 * @param id - The user ID to update
 * @param user - Partial user object with fields to update
 * @returns The updated user
 */
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

/**
 * Deletes a user from the database.
 * @param id - The user ID to delete
 */
export const remove = async (id: number): Promise<void> => {
  await pool.query("DELETE FROM users WHERE id_user = $1", [id]);
};
