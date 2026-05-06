// frontend/src/services/authentification_service.ts

import axios from "axios";

export default class AuthenticationService {
	private static BASE_URL = import.meta.env.VITE_API_BASE_URL;
	static isAuthenticated: any;

	static async login(email: string, password: string): Promise<boolean> {
		try {
			const response = await axios.post(
				`${this.BASE_URL}/auth/login`,
				{ email, password },
				{
					withCredentials: true, // Permet l'envoi des cookies sécurisés
				},
			);
			return response.status === 200;
		} catch (error) {
			console.error("Échec de la connexion", error);
			return false;
		}
	}

	static async logout(): Promise<void> {
		try {
			await axios.post(
				`${this.BASE_URL}/auth/logout`,
				{},
				{ withCredentials: true },
			);
		} catch (error) {
			console.error("Échec de la déconnexion", error);
		}
	}

	static async getCurrentUser(): Promise<any | null> {
		try {
			console.log("🔄 Envoi de la requête GET /auth/me...");
			const response = await axios.get(`${this.BASE_URL}/auth/me`, {
				withCredentials: true,
			});
			console.log(
				"✅ Réponse reçue de /auth/me :",
				response.status,
				response.data,
			);
			return response.data;
		} catch (error) {
			console.error("🚨 Erreur dans getCurrentUser :", error);
			return null;
		}
	}
}
