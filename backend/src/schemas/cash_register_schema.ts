// schemas/cash-register.schema.ts
import { z } from "zod";

export const createSchema = z.object({
	id_restaurant: z.number(),
});

export const closeSchema = z.object({
	funds: z.array(
		z.object({
			id_payment_type: z.number(),
			physical_amount: z.number(),
		}),
	),
});