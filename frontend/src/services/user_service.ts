import axios from "axios";
import type { User } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
}

class UserService {
	async getAll(page = 1, limit = 50): Promise<PaginatedResponse<User>> {
		const response = await axios.get<PaginatedResponse<User>>(
			`${BASE_URL}/users`,
			{ withCredentials: true, params: { page, limit } },
		);
		return response.data;
	}

	async getById(id: number): Promise<User> {
		const response = await axios.get<User>(
			`${BASE_URL}/users/${id}`,
			{ withCredentials: true },
		);
		return response.data;
	}

	async create(user: Partial<User> & { password: string }): Promise<User> {
		const response = await axios.post<User>(
			`${BASE_URL}/users`,
			user,
			{ withCredentials: true },
		);
		return response.data;
	}

	async update(id: number, data: Partial<User>): Promise<User> {
		const response = await axios.patch<User>(
			`${BASE_URL}/users/${id}`,
			data,
			{ withCredentials: true },
		);
		return response.data;
	}

	async remove(id: number): Promise<void> {
		await axios.delete(`${BASE_URL}/users/${id}`, { withCredentials: true });
	}
}

export default new UserService();
