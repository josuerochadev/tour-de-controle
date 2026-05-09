import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  COOKIE_MAX_AGE,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  RESET_TOKEN_EXPIRES_IN,
} from "../config/constants";
import { sendResetPasswordEmail } from "../config/mailer";
import { ApiError } from "../middlewares/error_middleware";
import * as actionLog from "../models/action_log_model";
import * as model from "../models/authentication_model";
import { comparePassword, hashPassword } from "../utils/password_utils";
import { blacklistToken } from "../utils/token_blacklist_utils";

/**
 * Authenticates a user with email and password, sets a JWT cookie on success.
 * @param req - Express request containing email and password in body
 * @param res - Express response
 * @returns JSON success message with auth cookie
 * @throws {ApiError} 400 if credentials missing, 401 if invalid
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Email and password are required", 400);
  }

  const user = await model.findByEmail(email);

  // Constant-time: always run bcrypt compare to prevent user enumeration via timing
  const DUMMY_HASH =
    "$2a$12$000000000000000000000uGiltReasonably.LongDummyHashForTiming";
  const isValidPassword = await comparePassword(
    password,
    user?.password ?? DUMMY_HASH,
  );
  if (!user || !isValidPassword) {
    throw new ApiError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    { userId: user.id_user, role: user.id_role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );

  actionLog.insert("AUTH", "LOGIN", user.id_user, { email: user.email });

  return res
    .cookie("authenticationToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
    })
    .status(200)
    .json({ message: "Connexion réussie" });
}

/**
 * Returns the currently authenticated user's profile.
 * @param req - Express request with authenticated user context
 * @param res - Express response
 * @returns JSON with user id, name, email, and role
 * @throws {ApiError} 401 if not authenticated, 404 if user not found
 */
export async function getMe(req: Request, res: Response) {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError("Not authenticated", 401);
  }
  const user = await model.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  return res.json({
    id: user.id_user,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.id_role,
  });
}

/**
 * Logs out the user by blacklisting the JWT token and clearing the auth cookie.
 * @param req - Express request with auth cookie
 * @param res - Express response
 * @returns JSON success message
 */
export async function logout(req: Request, res: Response) {
  const token = req.cookies.authenticationToken;
  if (token) {
    await blacklistToken(token);
  }
  actionLog.insert("AUTH", "LOGOUT", req.user?.userId);
  res.clearCookie("authenticationToken");
  return res.status(200).json({ message: "Déconnexion réussie" });
}

/**
 * Initiates the password reset flow by sending a reset email if the user exists.
 * @param req - Express request containing email in body
 * @param res - Express response
 * @returns Generic JSON message (does not reveal whether the email exists)
 */
export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;
  const genericMessage =
    "Si cet email existe, un lien de réinitialisation a été envoyé.";

  const user = await model.findByEmail(email);
  if (!user) {
    return res.json({ message: genericMessage });
  }

  const resetToken = jwt.sign({ email }, JWT_SECRET, {
    expiresIn: RESET_TOKEN_EXPIRES_IN,
  });
  await model.saveResetToken(email, resetToken);
  await sendResetPasswordEmail(email, resetToken);

  return res.json({ message: genericMessage });
}

/**
 * Resets a user's password using a valid reset token.
 * @param req - Express request containing token and new password in body
 * @param res - Express response
 * @returns JSON success message
 * @throws {ApiError} 400 if token/password missing or token invalid/expired
 */
export async function resetPassword(req: Request, res: Response) {
  const { token, password } = req.body;

  if (!token || !password) {
    throw new ApiError("Token et mot de passe requis", 400);
  }

  let decoded: { email: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { email: string };
  } catch {
    throw new ApiError("Token invalide ou expiré", 400);
  }

  const user = await model.findByEmail(decoded.email);
  if (!user || user.reset_token !== token) {
    throw new ApiError("Token invalide ou expiré", 400);
  }

  const hashedPassword = await hashPassword(password);
  await model.updatePasswordByEmail(decoded.email, hashedPassword);
  await model.saveResetToken(decoded.email, "");

  return res.json({ message: "Mot de passe mis à jour avec succès" });
}
