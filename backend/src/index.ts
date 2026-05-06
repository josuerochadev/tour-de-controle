// backend/src/index.ts
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

// Load environment variables from .env file
dotenv.config({
	path: path.resolve(__dirname, "../../.env"),
});

// Import database pool and route handlers
import pool from "./config/db";
import authRoutes from "./routes/authentication_routes";
import userRoutes from "./routes/user_routes";
import transactionRoutes from "./routes/transaction_routes";
import cashRegisterRoutes from "./routes/cash_register_routes";

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
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

// Swagger documentation route (before other routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cash-registers", cashRegisterRoutes);

// Health check route
app.get("/health", async (_req, res) => {
	try {
		/**
		 * Executes a SQL query to get the current date and time from the database.
		 *
		 * @returns {Promise<QueryResult>} A promise that resolves to the result of the query.
		 */
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
			error: (error as Error).message,
		});
	}
});

// 404 Middleware (if no route matched)
app.use((_req, res) => {
	return res.status(404).json({ message: "Not found" });
});

// Global error middleware – ALWAYS last
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
	console.log(`Backend running on port ${PORT} 🚀`);
});

// Handle process signals for graceful shutdown
process.on("SIGINT", () => {
	console.log("Server shutting down...");
	pool.end(() => {
		console.log("Database pool closed");
		process.exit(0);
	});
});
