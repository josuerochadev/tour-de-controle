import express from "express";
import {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
} from "../controllers/transaction_controller";
import {
	authenticateJWT,
	authorizeRoles,
} from "../middlewares/authentication_middleware";
import { validateBody } from "../middlewares/validate_middleware";
import { createSchema, updateSchema } from "../schemas/transaction_schema";
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
	updateById,
);

router.delete("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), deleteById);

export default router;
