import { z } from "zod";

export const passwordSchema = z
	.string()
	.min(8, "Le mot de passe doit contenir au moins 8 caracteres")
	.regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
	.regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre");

const phoneSchema = z
	.string()
	.regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format de telephone francais invalide")
	.optional()
	.or(z.literal(""));

export const createUserSchema = z.object({
	first_name: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
	last_name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
	email: z.string().email("Email invalide"),
	password: passwordSchema,
	postal_address: z.string().optional(),
	phone_number: phoneSchema,
	hire_date: z.string().min(1, "La date d'embauche est requise"),
	id_role: z.number().positive("Le role est requis"),
});

export const updateUserSchema = z.object({
	first_name: z.string().min(2, "Le prenom doit contenir au moins 2 caracteres"),
	last_name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
	email: z.string().email("Email invalide"),
	postal_address: z.string().optional(),
	phone_number: phoneSchema,
	hire_date: z.string().min(1, "La date d'embauche est requise"),
	id_role: z.number().positive("Le role est requis"),
});

export const resetPasswordSchema = z.object({
	password: passwordSchema,
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Les mots de passe ne correspondent pas",
	path: ["confirmPassword"],
});
