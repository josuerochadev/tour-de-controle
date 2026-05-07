import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/token_blacklist_utils";
import { JWT_SECRET } from "../config/constants";

declare global {
	namespace Express {
		interface Request {
			user?: {
				userId: number;
				role: number;
			};
		}
	}
}

/**
 * Express middleware that verifies the JWT auth cookie and attaches user info to the request.
 * @param req - Express request
 * @param res - Express response
 * @param next - Next middleware function
 * @returns 403 if no token, 401 if blacklisted or invalid
 */
export const authenticateJWT = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.authenticationToken;
	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}

	const blacklisted = await isTokenBlacklisted(token);
	if (blacklisted) {
		return res.status(401).json({ message: "Token is invalidated" });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {
			userId: number;
			role: number;
		};
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

/**
 * Returns an Express middleware that restricts access to the specified roles.
 * @param roles - Array of allowed role IDs
 * @returns Middleware that responds 403 if the user's role is not in the list
 */
export const authorizeRoles =
	(roles: readonly number[]) => (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !roles.includes(req.user.role)) {
			return res
				.status(403)
				.json({ message: "Forbidden: insufficient permissions" });
		}
		next();
	};
