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
import { createSchema, updateSchema } from "../schemas/user_schema";
import { ADMIN_ROLES } from "../config/constants";

const router = express.Router();

router.get("/", authenticateJWT, authorizeRoles(ADMIN_ROLES), getAll);
router.get("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), getById);
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
	validateBody(updateSchema),
	update,
);

router.delete("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), remove);
router.get("/me", authenticateJWT, getProfile);

export default router;
