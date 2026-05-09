import express from "express";
import { ADMIN_ROLES } from "../config/constants";
import { getAll } from "../controllers/action_log_controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/authentication_middleware";

const router = express.Router();

router.get("/", authenticateJWT, authorizeRoles(ADMIN_ROLES), getAll);

export default router;
