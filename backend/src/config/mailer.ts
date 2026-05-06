import nodemailer from "nodemailer";
import logger from "./logger";

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST || "smtp.ethereal.email",
	port: Number(process.env.SMTP_PORT) || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendResetPasswordEmail(email: string, token: string) {
	const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${token}`;

	try {
		await transporter.sendMail({
			from: process.env.SMTP_FROM || '"Tour de Contrôle" <noreply@tourdecontrole.app>',
			to: email,
			subject: "Réinitialisation de votre mot de passe",
			html: `
				<h2>Réinitialisation de mot de passe</h2>
				<p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
				<p>Cliquez sur le lien ci-dessous (valable 1 heure) :</p>
				<a href="${resetUrl}">${resetUrl}</a>
				<p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
			`,
		});
		logger.info("Reset password email sent", { to: email });
	} catch (error) {
		logger.error("Failed to send reset password email", { to: email, error });
	}
}
