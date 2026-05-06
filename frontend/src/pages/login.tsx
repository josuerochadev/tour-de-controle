import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthenticationService from "../services/authentification_service";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const success = await AuthenticationService.login(formData.email, formData.password);
			if (success) {
				const user = await AuthenticationService.getCurrentUser();
				if (user) {
					navigate("/dashboard");
				} else {
					setError("Impossible de récupérer l'utilisateur après connexion.");
				}
			} else {
				setError("Identifiants invalides");
			}
		} catch {
			setError("Une erreur est survenue");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
			<div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
				<div className="flex flex-col items-center mb-8">
					<img src="/LogoLaTourDeControle.png" alt="La Tour de Contrôle" className="h-24 w-24 mb-4" />
					<h2 className="text-2xl font-semibold">Se connecter</h2>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Identifiant *</label>
						<input id="email" name="email" type="email" required placeholder="exemple@restaurant.fr" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" value={formData.email} onChange={handleChange} disabled={loading} />
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
						<div className="relative">
							<input id="password" name="password" type={showPassword ? "text" : "password"} required placeholder="Votre mot de passe" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 pr-10" value={formData.password} onChange={handleChange} disabled={loading} />
							<button type="button" aria-label="Afficher le mot de passe" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700" tabIndex={-1}>
								{showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
							</button>
						</div>
					</div>

					<div className="mt-6 text-left text-xs">
						<Link to="/forgot-password" className="text-cyan-600 text-sm hover:text-cyan-700">Mot de passe oublié ?</Link>
					</div>

					{error && <div className="text-red-500 text-sm">{error}</div>}

					<button type="submit" aria-label="Se connecter" disabled={loading} className="w-full bg-cyan-600 text-white rounded-md py-2 font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? "Connexion en cours..." : "Connexion"}
					</button>
				</form>

				<div className="mt-8 text-sm text-gray-600 text-center">
					<p>Vous n'avez pas de compte ? <Link to="/contact" className="text-cyan-600 hover:text-cyan-700">Contactez-nous</Link></p>
					<p className="mt-2 text-xs">Besoin d'aide ? Votre identifiant est votre adresse e-mail enregistrée.</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
