import rateLimit from "express-rate-limit";
import { RATE_LIMIT } from "../config/constants";

const isTest = process.env.NODE_ENV === "test";
const isDev = process.env.NODE_ENV === "development";

export const apiLimiter = rateLimit({
	windowMs: RATE_LIMIT.API_WINDOW_MS,
	max: RATE_LIMIT.API_MAX_REQUESTS,
	message: "Too many requests from this IP, please try again after 15 minutes.",
	skip: () => isTest || isDev,
});

export const authLimiter = rateLimit({
	windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
	max: RATE_LIMIT.AUTH_MAX_ATTEMPTS,
	message: "Too many login attempts, please try again after an hour.",
	skip: () => isTest || isDev,
});
