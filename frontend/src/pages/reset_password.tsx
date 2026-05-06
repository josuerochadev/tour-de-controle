import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const ResetPassword = () => {
	const navigate = useNavigate();
	const [email] = useState(localStorage.getItem("resetEmail") || "");
	const [showPassword, setShowPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!email) {
			navigate("/forgot-password");
		}
	}, [email, navigate]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (newPassword !== confirmPassword) {
			setError("Les mots de passe ne correspondent pas");
			return;
		}

		setLoading(true);
		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`,
				{
					email,
					newPassword,
				},
			);
			localStorage.removeItem("resetEmail");
			navigate("/login", {
				state: { message: "Mot de passe réinitialisé avec succès" },
			});
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				console.log("Error details:", error.response?.data);
			} else {
				console.log("Unexpected error:", error);
			}
			setError("Erreur lors de la réinitialisation du mot de passe");
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
					<div className="text-center text-gray-600 mb-4">
						Pour l'email : {email}
					</div>

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
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							>
								{showPassword ? (
									<EyeOffIcon size={20} />
								) : (
									<EyeIcon size={20} />
								)}
							</button>
						</div>
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
