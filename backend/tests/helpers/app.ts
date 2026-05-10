import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "../../src/middlewares/error_middleware";
import authRoutes from "../../src/routes/authentication_routes";
import cashRegisterRoutes from "../../src/routes/cash_register_routes";
import transactionRoutes from "../../src/routes/transaction_routes";
import userRoutes from "../../src/routes/user_routes";

export function createTestApp() {
  const app = express();

  app.use(cors({ origin: "*", credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/transactions", transactionRoutes);
  app.use("/api/cash-registers", cashRegisterRoutes);

  app.use(errorHandler);

  return app;
}
