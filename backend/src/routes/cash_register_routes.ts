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
import { ADMIN_ROLES } from "../config/constants";

const router = express.Router();

router.get("/current", authenticateJWT, authorizeRoles(ADMIN_ROLES), current);

router.put(
	"/:id/close",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateBody(closeSchema),
	close,
);

router.post(
	"/",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateBody(createSchema),
	create,
);

export default router;
