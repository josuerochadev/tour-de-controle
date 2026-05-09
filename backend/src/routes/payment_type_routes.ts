import express from "express";
import pool from "../config/db";
import { authenticateJWT } from "../middlewares/authentication_middleware";

const router = express.Router();

router.get("/", authenticateJWT, async (_req, res) => {
  const result = await pool.query(
    "SELECT id_payment_type, payment_type_name FROM payment_types WHERE is_active = true ORDER BY id_payment_type",
  );
  return res.json(result.rows);
});

export default router;
