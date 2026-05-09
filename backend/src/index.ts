import path from "node:path";
import dotenv from "dotenv";
import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger/swagger";
import { FRONTEND_URL } from "./config/constants";
import logger from "./config/logger";
import { initMonitoring } from "./config/monitoring";
import { errorHandler } from "./middlewares/error_middleware";
import { apiLimiter } from "./middlewares/rate_limit_middleware";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

initMonitoring();

import pool from "./config/db";
import actionLogRoutes from "./routes/action_log_routes";
import authRoutes from "./routes/authentication_routes";
import cashRegisterRoutes from "./routes/cash_register_routes";
import paymentTypeRoutes from "./routes/payment_type_routes";
import transactionRoutes from "./routes/transaction_routes";
import userRoutes from "./routes/user_routes";
import { runMigrations } from "./scripts/migrate";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  cors({
    origin: process.env.CLIENT_URL || FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "Set-Cookie",
      "X-Requested-With",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));

// CSRF protection: reject state-changing requests without the X-Requested-With header.
// Browsers block cross-origin sites from setting custom headers, so this prevents CSRF.
app.use("/api", (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (
    !safeMethods.includes(req.method) &&
    req.headers["x-requested-with"] !== "XMLHttpRequest"
  ) {
    return res.status(403).json({ message: "Missing CSRF header" });
  }
  next();
});

app.use("/api", apiLimiter);

if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cash-registers", cashRegisterRoutes);
app.use("/api/payment-types", paymentTypeRoutes);
app.use("/api/action-logs", actionLogRoutes);

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.status(200).json({
      message: "API is up and running!",
      databaseConnected: true,
      currentTime: result.rows[0].now,
    });
  } catch (_error) {
    res.status(500).json({
      message: "API is running but failed to connect to the database",
      databaseConnected: false,
    });
  }
});

app.use((_req, res) => {
  return res.status(404).json({ message: "Not found" });
});

app.use(errorHandler);

runMigrations()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Migration failed, aborting startup", { error: err.message });
    process.exit(1);
  });

process.on("SIGINT", () => {
  logger.info("Server shutting down...");
  pool.end(() => {
    logger.info("Database pool closed");
    process.exit(0);
  });
});
