// backend/src/utils/password.utils.ts
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../config/constants';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};