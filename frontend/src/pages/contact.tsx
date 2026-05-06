import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthenticationService from "../services/authentification_service";

const ContactPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			await axios.post(
				`${import.meta.env.VITE_API_BASE_URL}/contact`,
				formData,
				{ headers: AuthenticationService.getAuthHeader() },
			);
			setSuccess(true);
		} catch (error) {
			console.error("Error sending message:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<div className="min-h-screen flex flex-col items-center justify-center px-4">
				<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
					<div className="flex flex-col items-center mb-8">
						<img
							src="/LogoLaTourDeControle.png"
							alt="La Tour de Contrôle"
							className="h-24 w-24 mb-4"
						/>
						<h2 className="text-2xl font-semibold">Contactez-nous</h2>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700"
							>
								Nom
							</label>
							<input
								type="text"
								id="name"
								name="name"
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
								value={formData.name}
								onChange={handleChange}
								disabled={loading}
							/>
						</div>

						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								required
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
								value={formData.email}
								onChange={handleChange}
								disabled={loading}
							/>
						</div>

						<div>
							<label
								htmlFor="message"
								className="block text-sm font-medium text-gray-700"
							>
								Message
							</label>
							<textarea
								id="message"
								name="message"
								required
								rows={4}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
								value={formData.message}
								onChange={handleChange}
								disabled={loading}
							/>
						</div>

						{success && (
							<div className="bg-green-50 p-4 rounded-md">
								<p className="text-green-800">
									Message envoyé avec succès ! Nous vous répondrons dans les
									plus brefs délais.
								</p>
							</div>
						)}

						<button
							type="submit"
							aria-label="Envoyer"
							disabled={loading}
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
						>
							{loading ? "Envoi en cours..." : "Envoyer"}
						</button>
					</form>

					<div className="mt-6">
						<Link to="/login" className="text-cyan-600 hover:text-cyan-500">
							Retour à la connexion
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
