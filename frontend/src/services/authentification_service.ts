import axios from "axios";
import type { AuthUser } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const logError = (context: string, error: unknown) => {
	if (import.meta.env.DEV) console.error(`[AuthService] ${context}`, error);
};

class AuthenticationService {
	async login(email: string, password: string): Promise<boolean> {
		try {
			const response = await axios.post(
				`${BASE_URL}/auth/login`,
				{ email, password },
				{ withCredentials: true },
			);
			return response.status === 200;
		} catch (error) {
			logError("login", error);
			return false;
		}
	}

	async logout(): Promise<void> {
		try {
			await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
		} catch (error) {
			logError("logout", error);
		}
	}

	async forgotPassword(email: string): Promise<boolean> {
		try {
			await axios.post(
				`${BASE_URL}/auth/forgot-password`,
				{ email },
				{ withCredentials: true },
			);
			return true;
		} catch (error) {
			logError("forgotPassword", error);
			return false;
		}
	}

	async resetPassword(token: string, password: string): Promise<boolean> {
		try {
			await axios.post(
				`${BASE_URL}/auth/reset-password`,
				{ token, password },
				{ withCredentials: true },
			);
			return true;
		} catch (error) {
			logError("resetPassword", error);
			return false;
		}
	}

	async getCurrentUser(): Promise<AuthUser | null> {
		try {
			const response = await axios.get<AuthUser>(`${BASE_URL}/auth/me`, {
				withCredentials: true,
			});
			return response.data;
		} catch (error) {
			logError("getCurrentUser", error);
			return null;
		}
	}
}

export default new AuthenticationService();
