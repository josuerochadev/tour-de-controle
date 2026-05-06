// routes/cash-register.routes.ts
import express from "express";

import {
	create,
	current,
	close,
} from "../controllers/cash_register_controller";

import {
	authenticateJWT,
	authorizeRoles,
} from "../middlewares/authentication_middleware";

import { validateBody } from "../middlewares/validate_middleware";
import { createSchema, closeSchema } from "../schemas/cash_register_schema";

const router = express.Router();
const adminRole = [1, 2];

router.get("/current", authenticateJWT, authorizeRoles(adminRole), current);

router.put(
	"/:id/close",
	authenticateJWT,
	authorizeRoles(adminRole),
	validateBody(closeSchema),
	close,
);

router.post(
	"/",
	authenticateJWT,
	authorizeRoles(adminRole),
	validateBody(createSchema),
	create,
);

export default router;
