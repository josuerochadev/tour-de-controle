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

const router = express.Router();

const adminRole = [1, 2];

router.get("/", authenticateJWT, authorizeRoles(adminRole), getAll);
router.get("/:id", authenticateJWT, authorizeRoles(adminRole), getById);
router.post(
	"/",
	authenticateJWT,
	authorizeRoles(adminRole),
	validateBody(createSchema),
	create,
);
router.patch(
	"/:id",
	authenticateJWT,
	authorizeRoles(adminRole),
	validateBody(updateSchema),
	update,
);

router.delete("/:id", authenticateJWT, authorizeRoles(adminRole), remove);
router.get("/me", authenticateJWT, getProfile);

export default router;
