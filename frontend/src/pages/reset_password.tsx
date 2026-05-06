import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ResetPassword = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [showPassword, setShowPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
				<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Lien invalide</h1>
					<p className="text-gray-600 mb-6">
						Ce lien de réinitialisation est invalide ou a expiré.
					</p>
					<button
						type="button"
						onClick={() => navigate("/forgot-password")}
						className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700"
					>
						Demander un nouveau lien
					</button>
				</div>
			</div>
		);
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (newPassword !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}

		if (newPassword.length < 8) {
			setError("Le mot de passe doit contenir au moins 8 caractères");
			return;
		}

		if (!/[A-Z]/.test(newPassword)) {
			setError("Le mot de passe doit contenir au moins une majuscule");
			return;
		}

		if (!/[0-9]/.test(newPassword)) {
			setError("Le mot de passe doit contenir au moins un chiffre");
			return;
		}

		setLoading(true);
		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
				{ token, password: newPassword },
				{ withCredentials: true },
			);
			navigate("/login", {
				state: { message: "Mot de passe réinitialisé avec succès" },
			});
		} catch {
			setError("Token invalide ou expiré. Veuillez refaire la demande.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
			<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
				<div className="flex flex-col items-center mb-6">
					<img
						src="/LogoLaTourDeControle.png"
						alt="La Tour de Contrôle"
						className="h-24 w-24 mb-4"
					/>
					<h1 className="text-2xl font-bold text-gray-900">
						Réinitialiser le mot de passe
					</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
							Nouveau mot de passe
						</label>
						<div className="relative mt-1">
							<input
								id="new-password"
								type={showPassword ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
								required
							/>
							<button
								type="button"
								aria-label="Afficher le mot de passe"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							>
								{showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
							</button>
						</div>
						<p className="mt-1 text-xs text-gray-500">
							Min. 8 caractères, 1 majuscule, 1 chiffre
						</p>
					</div>

					<div>
						<label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
							Confirmer le mot de passe
						</label>
						<div className="relative mt-1">
							<input
								id="confirm-password"
								type={showPassword ? "text" : "password"}
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500"
								required
							/>
						</div>
					</div>

					{error && (
						<div className="bg-red-50 text-red-800 p-3 rounded-md">{error}</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
