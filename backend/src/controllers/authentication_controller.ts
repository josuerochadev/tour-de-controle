import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ApiError } from "../middlewares/error_middleware";
import * as model from "../models/authentication_model";
import { hashPassword } from "../utils/password_utils";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/constants";
import { blacklistToken } from "../utils/token_blacklist_utils";

export async function login(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			throw new ApiError("Email and password are required", 400);
		}

		const user = await model.findByEmail(email);
		if (!user) {
			throw new ApiError("Invalid email or password", 401);
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			throw new ApiError("Invalid email or password", 401);
		}

		const token = jwt.sign(
			{ userId: user.id_user, role: user.id_role },
			JWT_SECRET,
			{ expiresIn: JWT_EXPIRES_IN },
		);

		return res
			.cookie("authenticationToken", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				maxAge: 3600000,
			})
			.status(200)
			.json({ message: "Connexion réussie" });
	} catch (error) {
		if (error instanceof ApiError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		return res.status(500).json({ message: "Internal Server Error" });
	}
}

export async function getMe(req: Request, res: Response) {
	const userId = req.user?.userId;
	if (!userId) {
		throw new ApiError("Not authenticated", 401);
	}
	const user = await model.findById(userId);
	if (!user) {
		throw new ApiError("User not found", 404);
	}

	res.setHeader(
		"Cache-Control",
		"no-store, no-cache, must-revalidate, proxy-revalidate",
	);
	res.setHeader("Pragma", "no-cache");
	res.setHeader("Expires", "0");

	return res.json({
		id: user.id_user,
		first_name: user.first_name,
		last_name: user.last_name,
		email: user.email,
		role: user.id_role,
	});
}

export async function logout(req: Request, res: Response) {
	try {
		const token = req.cookies.authenticationToken;
		if (token) {
			await blacklistToken(token);
		}
		res.clearCookie("authenticationToken");
		return res.status(200).json({ message: "Déconnexion réussie" });
	} catch (error) {
		return res.status(500).json({ message: "Erreur serveur" });
	}
}

export async function forgotPassword(req: Request, res: Response) {
	const { email } = req.body;

	try {
		const user = await model.findByEmail(email);
		if (!user) {
			// Réponse générique pour ne pas révéler si l'email existe
			return res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
		}

		const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
		await model.saveResetToken(email, resetToken);

		// TODO: Envoyer l'email avec nodemailer
		// En attendant, on retourne le token (dev uniquement)
		if (process.env.NODE_ENV !== "production") {
			return res.json({ message: "Token de réinitialisation généré.", token: resetToken });
		}

		return res.json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
	} catch (error) {
		return res.status(500).json({ message: "Erreur serveur" });
	}
}

export async function resetPassword(req: Request, res: Response) {
	const { token, password } = req.body;

	if (!token || !password) {
		return res.status(400).json({ message: "Token et mot de passe requis" });
	}

	try {
		// Vérifier et décoder le token
		const decoded = jwt.verify(token, JWT_SECRET) as { email: string };

		// Vérifier que le token correspond à celui stocké en BDD
		const user = await model.findByEmail(decoded.email);
		if (!user || user.reset_token !== token) {
			return res.status(400).json({ message: "Token invalide ou expiré" });
		}

		const hashedPassword = await hashPassword(password);
		await model.updatePasswordByEmail(decoded.email, hashedPassword);

		// Invalider le token après usage
		await model.saveResetToken(decoded.email, "");

		return res.json({ message: "Mot de passe mis à jour avec succès" });
	} catch (error) {
		if (error instanceof jwt.JsonWebTokenError) {
			return res.status(400).json({ message: "Token invalide ou expiré" });
		}
		return res.status(500).json({ message: "Erreur serveur" });
	}
}
