import axios from "axios";
import type { AuthUser } from "../types/user";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const logError = (context: string, error: unknown) => {
	if (import.meta.env.DEV) console.error(`[AuthService] ${context}`, error);
};

/** Handles all authentication-related API calls. */
class AuthenticationService {
	/**
	 * Authenticates a user with email and password.
	 * @param email - User email address.
	 * @param password - User password.
	 * @returns True if login succeeded, false otherwise.
	 */
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

	/** Logs out the current user by clearing the session cookie. */
	async logout(): Promise<void> {
		try {
			await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
		} catch (error) {
			logError("logout", error);
		}
	}

	/**
	 * Sends a password-reset email.
	 * @param email - The email address to send the reset link to.
	 * @returns True if the request succeeded.
	 */
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

	/**
	 * Resets the user password using a one-time token.
	 * @param token - Password-reset token from the email link.
	 * @param password - The new password.
	 * @returns True if the reset succeeded.
	 */
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

	/**
	 * Fetches the currently authenticated user from the session.
	 * @returns The authenticated user, or null if not logged in.
	 */
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
