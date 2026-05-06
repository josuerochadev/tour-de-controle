import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
				{ email },
				{ withCredentials: true },
			);
			setSubmitted(true);
		} catch {
			setError("Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
				<div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
					<img
						src="/LogoLaTourDeControle.png"
						alt="La Tour de Contrôle"
						className="h-24 w-24 mb-4 mx-auto"
					/>
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Email envoyé</h1>
					<p className="text-gray-600 mb-6">
						Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation par email.
					</p>
					<Link to="/login" className="text-cyan-600 hover:text-cyan-500">
						Retour à la connexion
					</Link>
				</div>
			</div>
		);
	}

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
						Mot de Passe Oublié
					</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
							Adresse e-mail *
						</label>
						<div className="relative">
							<FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<input
								type="email"
								name="email"
								id="email"
								placeholder="Adresse e-mail"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm
                           focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
							/>
						</div>
					</div>

					{error && (
						<div className="p-3 rounded-md bg-red-50">
							<p className="text-red-800">{error}</p>
						</div>
					)}

					<button
						type="submit"
						aria-label="Envoyer"
						disabled={loading}
						className="w-full bg-cyan-600 text-white rounded-md py-2 font-medium
                       hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500
                       disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Envoi en cours..." : "Envoyer le lien"}
					</button>
				</form>

				<div className="mt-4 text-center">
					<Link to="/login" className="text-cyan-600 hover:text-cyan-500">
						Retour
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
