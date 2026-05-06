import express from "express";

import {
	login,
	logout,
	forgotPassword,
	getMe,
	resetPassword,
} from "../controllers/authentication_controller";
import { authenticateJWT } from "../middlewares/authentication_middleware";
import { authLimiter } from "../middlewares/rate_limit_middleware";

const router = express.Router();

router.post("/login", authLimiter, login);
router.get("/me", authenticateJWT, getMe);
router.post("/logout", authenticateJWT, logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
