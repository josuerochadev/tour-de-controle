// schemas/transaction.schema.ts
import { z } from "zod";

// Base schema for shared fields
const baseTransactionSchema = {
  amount: z.number().positive(),
  tip: z.number().min(0).optional(),
  id_payment_type: z.number().positive(),
  id_cash_register: z.number().positive(),
};

// Create schema
export const createSchema = z.object({
  ...baseTransactionSchema,
  created_by: z.number().positive(),
});

// Update schema
export const updateSchema = z
  .object({
    ...baseTransactionSchema,
    updated_at: z.date().optional(),
  })
  .partial();

// Filter schema
export const filterSchema = z.object({
  date_from: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  date_to: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  payment_type: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  amount_min: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  amount_max: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  user_id: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
});
