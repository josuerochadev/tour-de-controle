import React, { useState } from "react";
import { Link } from "react-router-dom";
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
			setError("Une erreur est survenue. Veuillez reessayer.");
		} finally {
			setLoading(false);
		}
	};

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-paper p-4">
				<div className="bg-paper-soft border border-sand rounded-3xl p-8 w-full max-w-md text-center">
					<h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink mb-4">Email envoye</h1>
					<p className="text-ink-3 mb-6">
						Si un compte existe avec l'adresse <strong className="text-ink">{email}</strong>, vous recevrez un lien de reinitialisation par email.
					</p>
					<Link to="/login" className="text-ink underline underline-offset-4 decoration-ink-4 hover:text-signal hover:decoration-signal font-mono text-sm tracking-wide">
						Retour a la connexion
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-paper p-4">
			<div className="bg-paper-soft border border-sand rounded-3xl p-8 w-full max-w-md">
				<div className="flex flex-col items-center mb-8">
					<svg width={64} height={64} viewBox="0 0 64 64" className="text-ink mb-4">
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
					<h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink">
						Mot de passe oublie
					</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label htmlFor="email" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 block mb-1.5">
							Adresse e-mail *
						</label>
						<input
							type="email"
							name="email"
							id="email"
							placeholder="Adresse e-mail"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full py-3.5 px-4 border border-sand rounded-[14px] bg-paper-soft font-sans text-base text-ink outline-none focus:ring-2 focus:ring-signal"
						/>
					</div>

					{error && (
						<div className="p-3 rounded-2xl bg-danger-soft">
							<p className="text-signal text-sm">{error}</p>
						</div>
					)}

					<button
						type="submit"
						aria-label="Envoyer"
						disabled={loading}
						className="w-full py-4 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-2 transition-colors duration-200"
					>
						{loading ? "Envoi en cours..." : "Envoyer le lien"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<Link to="/login" className="text-ink underline underline-offset-4 decoration-ink-4 hover:text-signal hover:decoration-signal font-mono text-sm tracking-wide">
						Retour
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
