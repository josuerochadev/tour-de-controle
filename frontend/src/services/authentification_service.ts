import axios from "axios";
import type { AuthUser } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default class AuthenticationService {
	static async login(email: string, password: string): Promise<boolean> {
		try {
			const response = await axios.post(
				`${BASE_URL}/auth/login`,
				{ email, password },
				{ withCredentials: true },
			);
			return response.status === 200;
		} catch {
			return false;
		}
	}

	static async logout(): Promise<void> {
		try {
			await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
		} catch {
			// Silent fail — cookie will be cleared server-side
		}
	}

	static async getCurrentUser(): Promise<AuthUser | null> {
		try {
			const response = await axios.get<AuthUser>(`${BASE_URL}/auth/me`, {
				withCredentials: true,
			});
			return response.data;
		} catch {
			return null;
		}
	}
}
