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

/**
 * @swagger
 * /api/cash-registers/current:
 *   get:
 *     tags: [Cash Registers]
 *     summary: Caisses actuellement ouvertes
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des caisses ouvertes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CashRegister'
 */
router.get("/current", authenticateJWT, authorizeRoles(ADMIN_ROLES), current);

/**
 * @swagger
 * /api/cash-registers/{id}/close:
 *   put:
 *     tags: [Cash Registers]
 *     summary: Fermer une caisse
 *     description: Cloture la caisse en comparant les fonds physiques aux transactions enregistrees.
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
 *             $ref: '#/components/schemas/CashRegisterClose'
 *     responses:
 *       200:
 *         description: Caisse fermee avec details d'ecart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cashRegister:
 *                   $ref: '#/components/schemas/CashRegister'
 *                 hasGap:
 *                   type: boolean
 *       404:
 *         description: Caisse non trouvee
 */
router.put(
	"/:id/close",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateBody(closeSchema),
	close,
);

/**
 * @swagger
 * /api/cash-registers:
 *   post:
 *     tags: [Cash Registers]
 *     summary: Ouvrir une nouvelle caisse
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_restaurant]
 *             properties:
 *               id_restaurant:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Caisse ouverte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CashRegister'
 */
router.post(
	"/",
	authenticateJWT,
	authorizeRoles(ADMIN_ROLES),
	validateBody(createSchema),
	create,
);

export default router;
