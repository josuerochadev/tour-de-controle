import express from "express";

import {
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
} from "../controllers/authentication_controller";
import { authenticateJWT } from "../middlewares/authentication_middleware";
import { authLimiter } from "../middlewares/rate_limit_middleware";

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur et retourne un JWT dans un cookie httpOnly.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion reussie — cookie authenticationToken defini
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post("/login", authLimiter, login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
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
 *       401:
 *         description: Non authentifie
 */
router.get("/me", authenticateJWT, getMe);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Deconnexion
 *     description: Blackliste le JWT courant et supprime le cookie.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Deconnexion reussie
 *       401:
 *         description: Non authentifie
 */
router.post("/logout", authenticateJWT, logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Demande de reinitialisation de mot de passe
 *     description: Envoie un email avec un lien de reinitialisation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email envoye (meme si l'adresse n'existe pas, pour eviter l'enumeration)
 */
router.post("/forgot-password", authLimiter, forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reinitialisation du mot de passe
 *     description: Change le mot de passe via un token de reinitialisation valide.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 description: Min 8 chars, 1 majuscule, 1 chiffre
 *     responses:
 *       200:
 *         description: Mot de passe modifie avec succes
 *       400:
 *         description: Token invalide ou expire
 */
router.post("/reset-password", authLimiter, resetPassword);

export default router;
