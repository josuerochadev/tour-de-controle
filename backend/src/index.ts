import path from "node:path";
import dotenv from "dotenv";
import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger/swagger";
import { errorHandler } from "./middlewares/error_middleware";
import { apiLimiter } from "./middlewares/rate_limit_middleware";
import logger from "./config/logger";

dotenv.config({
	path: path.resolve(__dirname, "../../.env"),
});

import pool from "./config/db";
import authRoutes from "./routes/authentication_routes";
import userRoutes from "./routes/user_routes";
import transactionRoutes from "./routes/transaction_routes";
import cashRegisterRoutes from "./routes/cash_register_routes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", apiLimiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cash-registers", cashRegisterRoutes);

app.get("/health", async (_req, res) => {
	try {
		const result = await pool.query("SELECT NOW()");
		res.status(200).json({
			message: "API is up and running!",
			databaseConnected: true,
			currentTime: result.rows[0].now,
		});
	} catch (error) {
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

app.listen(PORT, () => {
	logger.info(`Backend running on port ${PORT}`);
});

process.on("SIGINT", () => {
	logger.info("Server shutting down...");
	pool.end(() => {
		logger.info("Database pool closed");
		process.exit(0);
	});
});
