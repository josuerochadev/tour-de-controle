// backend/src/config/constants.ts
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_EXPIRES_IN = '24h';
export const SALT_ROUNDS = 12;