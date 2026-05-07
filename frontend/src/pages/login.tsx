import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthenticationService from "../services/authentification_service";
import PasswordInput from "../components/password_input";

const Logo = ({ size = 120 }: { size?: number }) => (
	<svg width={size} height={size} viewBox="0 0 64 64" className="text-paper">
		<path d="M32 18 L52 8 L52 28 Z" fill="#f59e0b" opacity="0.55" />
		<path d="M32 18 L12 8 L12 28 Z" fill="#f59e0b" opacity="0.55" />
		<path d="M24 22 L40 22 L42 56 L22 56 Z" fill="currentColor" />
		<rect x="26" y="14" width="12" height="10" rx="1.5" fill="currentColor" />
		<circle cx="32" cy="19" r="3" fill="#dc2626" />
		<path d="M28 14 L36 14 L34 10 L30 10 Z" fill="currentColor" />
		<circle cx="32" cy="9" r="1.5" fill="currentColor" />
		<rect x="24" y="36" width="18" height="4" fill="#dc2626" />
		<rect x="20" y="56" width="24" height="3" rx="1" fill="currentColor" />
	</svg>
);

const Login: React.FC = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
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
					setError("Impossible de recuperer l'utilisateur apres connexion.");
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
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-paper">
			{/* Left — Form */}
			<div className="px-8 py-12 lg:px-14 flex flex-col justify-between gap-12">
				{/* Wordmark */}
				<div className="flex items-center gap-3 text-ink">
					<svg width={36} height={36} viewBox="0 0 64 64">
						<path d="M32 18 L52 8 L52 28 Z" fill="#f59e0b" opacity="0.55" />
						<path d="M32 18 L12 8 L12 28 Z" fill="#f59e0b" opacity="0.55" />
						<path d="M24 22 L40 22 L42 56 L22 56 Z" fill="currentColor" />
						<rect x="26" y="14" width="12" height="10" rx="1.5" fill="currentColor" />
						<circle cx="32" cy="19" r="3" fill="#dc2626" />
						<path d="M28 14 L36 14 L34 10 L30 10 Z" fill="currentColor" />
						<circle cx="32" cy="9" r="1.5" fill="currentColor" />
						<rect x="24" y="36" width="18" height="4" fill="#dc2626" />
						<rect x="20" y="56" width="24" height="3" rx="1" fill="currentColor" />
					</svg>
					<div className="flex flex-col leading-none">
						<span className="font-display text-sm font-semibold tracking-wider">TOUR DE CONTROLE</span>
						<span className="font-mono text-[10px] tracking-[2px] uppercase text-ink-4 mt-1">Restaurant ops</span>
					</div>
				</div>

				{/* Form */}
				<div className="max-w-[420px]">
					<div className="font-mono text-[11px] tracking-[2px] uppercase text-ink-4 mb-5">// Acces operateur</div>
					<h1 className="font-display text-[44px] leading-[1.05] tracking-tight font-semibold uppercase m-0">
						Bienvenue.<br />Prenez le <span className="text-signal">quart</span>.
					</h1>

					<form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-4">
						<label className="block">
							<div className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 mb-1.5">Identifiant</div>
							<input
								name="email"
								type="email"
								required
								placeholder="exemple@restaurant.fr"
								className="w-full py-3.5 px-4 border border-sand rounded-[14px] bg-paper-soft font-sans text-base text-ink outline-none focus:ring-2 focus:ring-signal"
								value={formData.email}
								onChange={handleChange}
								disabled={loading}
							/>
						</label>

						<label className="block">
							<div className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 mb-1.5">Mot de passe</div>
							<PasswordInput
								id="password"
								name="password"
								required
								placeholder="Votre mot de passe"
								className="w-full py-3.5 px-4 border border-sand rounded-[14px] bg-paper-soft font-sans text-base text-ink outline-none focus:ring-2 focus:ring-signal"
								value={formData.password}
								onChange={handleChange}
								disabled={loading}
							/>
						</label>

						<div className="text-left">
							<Link to="/forgot-password" className="font-mono text-xs text-ink-3 underline underline-offset-4 decoration-ink-4 hover:text-signal hover:decoration-signal tracking-wide">
								Mot de passe oublie ?
							</Link>
						</div>

						{error && <div className="text-signal text-sm font-medium">{error}</div>}

						<button
							type="submit"
							aria-label="Prendre le quart"
							disabled={loading}
							className="mt-2 py-4 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-[13px] font-semibold tracking-wider cursor-pointer uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-2 transition-colors duration-200"
						>
							{loading ? "Connexion en cours..." : "PRENDRE LE QUART →"}
						</button>
					</form>

					<div className="mt-8 text-sm text-ink-3">
						<p>Vous n'avez pas de compte ? <Link to="/contact" className="text-ink underline underline-offset-4 decoration-ink-4 hover:text-signal hover:decoration-signal">Contactez-nous</Link></p>
					</div>
				</div>

				{/* Footer */}
				<div className="font-mono text-[11px] text-ink-4 tracking-wider">
					v2.0 &middot; phare operationnel &middot; {new Date().toLocaleDateString("fr-FR")}
				</div>
			</div>

			{/* Right — Beacon art */}
			<div className="relative bg-ink overflow-hidden hidden lg:flex items-center justify-center">
				{/* Rotating beams */}
				<div className="absolute inset-[-100px] flex items-center justify-center">
					<div className="w-[1000px] h-[1000px] relative animate-tdc-rotate">
						{[0, 120, 240].map((deg) => (
							<div
								key={deg}
								className="absolute left-1/2 top-1/2 w-[800px] h-[220px] blur-[20px]"
								style={{
									transform: `translate(-50%, -50%) rotate(${deg}deg)`,
									background: "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.18) 40%, rgba(220,38,38,0.35) 50%, rgba(245,158,11,0.18) 60%, transparent 100%)",
								}}
							/>
						))}
					</div>
				</div>
				{/* Vignette */}
				<div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, transparent 0%, rgba(28,25,23,0.7) 70%)" }} />
				{/* Content */}
				<div className="relative text-center text-paper p-8">
					<Logo size={120} />
					<div className="mt-7 font-display text-[22px] font-medium tracking-[2px] uppercase">
						&laquo; Garde le cap &raquo;
					</div>
					<div className="font-mono text-[11px] tracking-[2px] uppercase mt-3.5 text-ink-4">
						Phare operationnel &middot; est. 2024
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
