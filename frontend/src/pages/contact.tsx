import React, { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import ContactService from "../services/contact_service";

const contactSchema = z.object({
	name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
	email: z.string().email("Email invalide"),
	message: z.string().min(10, "Le message doit contenir au moins 10 caracteres"),
});

const inputClass = "w-full py-3.5 px-4 border border-sand rounded-[14px] bg-paper-soft font-sans text-base text-ink outline-none focus:ring-2 focus:ring-signal";

const ContactPage = () => {
	const [formData, setFormData] = useState({ name: "", email: "", message: "" });
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setValidationErrors({});

		const result = contactSchema.safeParse(formData);
		if (!result.success) {
			const errors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				errors[issue.path[0] as string] = issue.message;
			}
			setValidationErrors(errors);
			setLoading(false);
			return;
		}

		try {
			const success = await ContactService.send(formData);
			if (success) {
				setSuccess(true);
			} else {
				setError("Erreur lors de l'envoi du message. Veuillez reessayer.");
			}
		} catch {
			setError("Erreur lors de l'envoi du message. Veuillez reessayer.");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="min-h-screen bg-paper p-4">
			<div className="min-h-screen flex flex-col items-center justify-center px-4">
				<div className="bg-paper-soft border border-sand rounded-3xl p-8 w-full max-w-md">
					<div className="flex flex-col items-center mb-8">
						<svg width={64} height={64} viewBox="0 0 64 64" className="text-ink mb-4" aria-hidden="true">
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
						<h1 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink">Contactez-nous</h1>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label htmlFor="name" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 block mb-1.5">Nom</label>
							<input type="text" id="name" name="name" required className={inputClass} value={formData.name} onChange={handleChange} disabled={loading} />
							{validationErrors.name && <p className="text-signal text-xs mt-1">{validationErrors.name}</p>}
						</div>
						<div>
							<label htmlFor="email" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 block mb-1.5">Email</label>
							<input type="email" id="email" name="email" required className={inputClass} value={formData.email} onChange={handleChange} disabled={loading} />
							{validationErrors.email && <p className="text-signal text-xs mt-1">{validationErrors.email}</p>}
						</div>
						<div>
							<label htmlFor="message" className="font-mono text-[11px] tracking-[1.5px] uppercase text-ink-3 block mb-1.5">Message</label>
							<textarea id="message" name="message" required rows={4} className={`${inputClass} resize-none`} value={formData.message} onChange={handleChange} disabled={loading} />
							{validationErrors.message && <p className="text-signal text-xs mt-1">{validationErrors.message}</p>}
						</div>

						{success && (
							<div className="bg-ok-soft p-4 rounded-2xl">
								<p className="text-ok-deep text-sm">Message envoye avec succes ! Nous vous repondrons dans les plus brefs delais.</p>
							</div>
						)}

						{error && (
							<div className="bg-danger-soft p-4 rounded-2xl">
								<p className="text-signal text-sm">{error}</p>
							</div>
						)}

						<button type="submit" aria-label="Envoyer" disabled={loading} className="w-full py-4 px-6 rounded-[14px] bg-ink text-paper border-none font-display text-[13px] font-semibold tracking-wider uppercase cursor-pointer disabled:opacity-50 hover:bg-ink-2 transition-colors duration-200">
							{loading ? "Envoi en cours..." : "Envoyer"}
						</button>
					</form>

					<div className="mt-6">
						<Link to="/login" className="text-ink underline underline-offset-4 decoration-ink-4 hover:text-signal hover:decoration-signal font-mono text-sm tracking-wide">
							Retour a la connexion
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
