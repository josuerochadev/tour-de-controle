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
	updateById,
);

router.delete("/:id", authenticateJWT, authorizeRoles(adminRole), deleteById);

export default router;
