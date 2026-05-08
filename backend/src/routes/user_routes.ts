import express from "express";
import { ADMIN_ROLES } from "../config/constants";
import {
  create,
  getAll,
  getById,
  getProfile,
  remove,
  update,
} from "../controllers/user_controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authentication_middleware";
import { validateIdParam } from "../middlewares/validate_id_param";
import { validateBody } from "../middlewares/validate_middleware";
import { createSchema, updateSchema } from "../schemas/user_schema";

const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Profil de l'utilisateur connecte
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get("/me", authenticateJWT, getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Liste des utilisateurs (pagine)
 *     security:
 *       - cookieAuth: []
 *     parameters:
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
 *         description: Liste paginee
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       403:
 *         description: Acces refuse (role insuffisant)
 */
router.get("/", authenticateJWT, authorizeRoles(ADMIN_ROLES), getAll);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Detail d'un utilisateur
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
 *         description: Utilisateur trouve
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur non trouve
 */
router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles(ADMIN_ROLES),
  validateIdParam(),
  getById,
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Creer un utilisateur
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       201:
 *         description: Utilisateur cree
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
 * /api/users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Modifier un utilisateur
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
 *             $ref: '#/components/schemas/UserCreate'
 *     responses:
 *       200:
 *         description: Utilisateur modifie
 *       404:
 *         description: Utilisateur non trouve
 */
router.patch(
  "/:id",
  authenticateJWT,
  authorizeRoles(ADMIN_ROLES),
  validateIdParam(),
  validateBody(updateSchema),
  update,
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur
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
 *         description: Utilisateur supprime
 *       404:
 *         description: Utilisateur non trouve
 */
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles(ADMIN_ROLES),
  validateIdParam(),
  remove,
);

export default router;
