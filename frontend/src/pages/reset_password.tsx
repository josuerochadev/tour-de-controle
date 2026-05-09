import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthenticationService from "../services/authentification_service";
import LogoIcon from "../components/logo_icon";
import PasswordInput from "../components/password_input";
import { resetPasswordSchema } from "../schemas/user_schema";

const inputClass = "w-full py-3.5 px-4 border border-sand rounded-[14px] bg-paper-soft font-sans text-base text-ink outline-none focus:ring-2 focus:ring-signal";

const ResetPassword = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-paper p-4">
				<div className="bg-paper-soft border border-sand rounded-3xl p-8 w-full max-w-md text-center">
					<h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink mb-4">Lien invalide</h1>
					<p className="text-ink-3 mb-6">
						Ce lien de reinitialisation est invalide ou a expire.
					</p>
					<button
						type="button"
						onClick={() => navigate("/forgot-password")}
						className="py-3 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer hover:bg-ink-2 transition-colors"
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

		const result = resetPasswordSchema.safeParse({ password: newPassword, confirmPassword });
		if (!result.success) {
			setError(result.error.errors[0].message);
			return;
		}

		setLoading(true);
		try {
			const success = await AuthenticationService.resetPassword(token, newPassword);
			if (success) {
				navigate("/login", {
					state: { message: "Mot de passe reinitialise avec succes" },
				});
			} else {
				setError("Token invalide ou expire. Veuillez refaire la demande.");
			}
		} catch {
			setError("Token invalide ou expire. Veuillez refaire la demande.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-paper p-4">
			<div className="bg-paper-soft border border-sand rounded-3xl p-8 w-full max-w-md">
				<div className="flex flex-col items-center mb-8">
					<LogoIcon size={64} className="text-ink mb-4" />
					<h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink">
						Reinitialiser le mot de passe
					</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					<div>
						<label htmlFor="new-password" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 block mb-1.5">
							Nouveau mot de passe
						</label>
						<PasswordInput
							id="new-password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className={inputClass}
							required
						/>
						<p className="mt-1 text-xs text-ink-4">
							Min. 8 caracteres, 1 majuscule, 1 chiffre
						</p>
					</div>

					<div>
						<label htmlFor="confirm-password" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 block mb-1.5">
							Confirmer le mot de passe
						</label>
						<PasswordInput
							id="confirm-password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className={inputClass}
							required
						/>
					</div>

					{error && (
						<div role="alert" className="bg-danger-soft text-signal p-3 rounded-2xl text-sm">{error}</div>
					)}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-4 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ink-2 transition-colors duration-200"
					>
						{loading ? "Reinitialisation..." : "Reinitialiser le mot de passe"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
