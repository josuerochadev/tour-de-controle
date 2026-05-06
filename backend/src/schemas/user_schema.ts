// schemas/user.schema.ts
import { z } from "zod";

export const createSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  postal_address: z.string().optional(),
  phone_number: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Format de téléphone français invalide")
    .optional(),
  hire_date: z.string(),
  id_role: z.number().positive(),
});

export const updateSchema = createSchema.partial();
