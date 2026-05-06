export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '1h';
export const SALT_ROUNDS = 12;

export const DEFAULT_PAGE_LIMIT = 50;
export const COOKIE_MAX_AGE = 3_600_000; // 1 hour in ms

export const RATE_LIMIT = {
	API_WINDOW_MS: 15 * 60 * 1000,   // 15 minutes
	API_MAX_REQUESTS: 100,
	AUTH_WINDOW_MS: 60 * 60 * 1000,   // 1 hour
	AUTH_MAX_ATTEMPTS: 5,
} as const;

export const ROLES = {
	DEVELOPER: 1,
	MANAGER: 2,
	SUPERVISOR: 3,
	SERVER: 4,
} as const;

export const ADMIN_ROLES = [ROLES.DEVELOPER, ROLES.MANAGER];

export const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";