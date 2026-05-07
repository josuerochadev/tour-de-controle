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
import { validateIdParam } from "../middlewares/validate_id_param";
import { createSchema, updateSchema } from "../schemas/transaction_schema";
import { ADMIN_ROLES } from "../config/constants";

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Liste des transactions (paginee, filtrable)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: payment_type
 *         schema:
 *           type: integer
 *       - in: query
 *         name: amount_min
 *         schema:
 *           type: number
 *       - in: query
 *         name: amount_max
 *         schema:
 *           type: number
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste paginee de transactions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
router.get("/", authenticateJWT, authorizeRoles(ADMIN_ROLES), getAll);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Detail d'une transaction
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction trouvee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction non trouvee
 */
router.get("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), validateIdParam(), getById);

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Creer une transaction
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionCreate'
 *     responses:
 *       201:
 *         description: Transaction creee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Donnees invalides
 */
router.post(
	"/",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateBody(createSchema),
	create,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   patch:
 *     tags: [Transactions]
 *     summary: Modifier une transaction
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionCreate'
 *     responses:
 *       200:
 *         description: Transaction modifiee
 *       404:
 *         description: Transaction non trouvee
 */
router.patch(
	"/:id",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateIdParam(),
	validateBody(updateSchema),
	updateById,
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     summary: Supprimer une transaction
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Transaction supprimee
 *       404:
 *         description: Transaction non trouvee
 */
router.delete("/:id", authenticateJWT, authorizeRoles(ADMIN_ROLES), validateIdParam(), deleteById);

export default router;
