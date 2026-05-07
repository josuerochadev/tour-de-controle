import axios from "axios";
import type { User } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

/** Handles CRUD operations for user management. */
class UserService {
	/**
	 * Fetches a paginated list of users.
	 * @param page - Page number (defaults to 1).
	 * @param limit - Number of users per page (defaults to 50).
	 * @returns Paginated response containing users.
	 */
	async getAll(page = 1, limit = 50): Promise<PaginatedResponse<User>> {
		const response = await axios.get<PaginatedResponse<User>>(
			`${BASE_URL}/users`,
			{ withCredentials: true, params: { page, limit } },
		);
		return response.data;
	}

	/**
	 * Fetches a single user by ID.
	 * @param id - The user ID.
	 * @returns The matching user.
	 */
	async getById(id: number): Promise<User> {
		const response = await axios.get<User>(
			`${BASE_URL}/users/${id}`,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Creates a new user.
	 * @param user - User data including a required password.
	 * @returns The newly created user.
	 */
	async create(user: Partial<User> & { password: string }): Promise<User> {
		const response = await axios.post<User>(
			`${BASE_URL}/users`,
			user,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Partially updates an existing user.
	 * @param id - The user ID.
	 * @param data - Fields to update.
	 * @returns The updated user.
	 */
	async update(id: number, data: Partial<User>): Promise<User> {
		const response = await axios.patch<User>(
			`${BASE_URL}/users/${id}`,
			data,
			{ withCredentials: true },
		);
		return response.data;
	}

	/**
	 * Deletes a user by ID.
	 * @param id - The user ID to delete.
	 */
	async remove(id: number): Promise<void> {
		await axios.delete(`${BASE_URL}/users/${id}`, { withCredentials: true });
	}
}

export default new UserService();
