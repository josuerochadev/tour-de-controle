// routes/user.routes.ts
import express from "express";
import {
	getAll,
	getById,
	create,
	update,
	remove,
	getProfile,
} from "../controllers/user_controller";

import {
	authenticateJWT,
	authorizeRoles,
} from "../middlewares/authentication_middleware";

import { validateBody } from "../middlewares/validate_middleware";
import { validateIdParam } from "../middlewares/validate_id_param";
import { createSchema, updateSchema } from "../schemas/user_schema";
import { ADMIN_ROLES } from "../config/constants";

const router = express.Router();

router.get("/me", authenticateJWT, getProfile);
router.get("/", authenticateJWT, authorizeRoles(ADMIN_ROLES), getAll);
router.get("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), validateIdParam(), getById);
router.post(
	"/",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateBody(createSchema),
	create,
);
router.patch(
	"/:id",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateIdParam(),
	validateBody(updateSchema),
	update,
);
router.delete("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), validateIdParam(), remove);

export default router;
