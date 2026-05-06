// schemas/auth.schema.ts
import { z } from "zod";

export const login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const resetPassword = z.object({
  token: z.string(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});
