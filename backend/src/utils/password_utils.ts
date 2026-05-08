// backend/src/utils/password.utils.ts
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "../config/constants";

/**
 * Hashes a plaintext password using bcrypt.
 * @param password - The plaintext password to hash
 * @returns The bcrypt hash string
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plaintext password against a bcrypt hash.
 * @param password - The plaintext password to verify
 * @param hash - The bcrypt hash to compare against
 * @returns True if the password matches the hash
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
