export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '1h';
export const SALT_ROUNDS = 12;

export const ROLES = {
	DEVELOPER: 1,
	MANAGER: 2,
	SUPERVISOR: 3,
	SERVER: 4,
} as const;

export const ADMIN_ROLES = [ROLES.DEVELOPER, ROLES.MANAGER];