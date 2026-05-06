import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createTestApp } from "../helpers/app";
import { getAuthCookie } from "../helpers/auth";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

// Mock the database pool
jest.mock("../../src/config/db", () => ({
	__esModule: true,
	default: { query: jest.fn() },
}));

jest.mock("../../src/config/mailer", () => ({
	sendResetPasswordEmail: jest.fn().mockResolvedValue(undefined),
}));

import pool from "../../src/config/db";

const mockQuery = pool.query as jest.Mock;
const app = createTestApp();

describe("Auth Endpoints", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// --- LOGIN ---

	describe("POST /api/auth/login", () => {
		const validPassword = "Password1";
		let hashedPassword: string;

		beforeAll(async () => {
			hashedPassword = await bcrypt.hash(validPassword, 10);
		});

		it("should return 200 and set cookie on valid credentials", async () => {
			mockQuery.mockResolvedValueOnce({
				rows: [{ id_user: 1, email: "test@test.com", password: hashedPassword, id_role: 1 }],
			});

			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "test@test.com", password: validPassword });

			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Connexion réussie");
			expect(res.headers["set-cookie"]).toBeDefined();
			expect(res.headers["set-cookie"][0]).toContain("authenticationToken");
		});

		it("should return 401 on invalid password", async () => {
			mockQuery.mockResolvedValueOnce({
				rows: [{ id_user: 1, email: "test@test.com", password: hashedPassword, id_role: 1 }],
			});

			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "test@test.com", password: "WrongPassword1" });

			expect(res.status).toBe(401);
		});

		it("should return 401 on unknown email", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [] });

			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "unknown@test.com", password: "Password1" });

			expect(res.status).toBe(401);
		});

		it("should return 400 if email or password missing", async () => {
			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "test@test.com" });

			expect(res.status).toBe(400);
		});
	});

	// --- GET ME ---

	describe("GET /api/auth/me", () => {
		it("should return user info with valid token", async () => {
			mockQuery.mockResolvedValueOnce({
				rows: [{ id_user: 1, first_name: "Josué", last_name: "Rocha", email: "test@test.com", id_role: 1 }],
			});

			const res = await request(app)
				.get("/api/auth/me")
				.set("Cookie", getAuthCookie());

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("id", 1);
			expect(res.body).toHaveProperty("email", "test@test.com");
			expect(res.body).toHaveProperty("role", 1);
		});

		it("should return 403 without token", async () => {
			const res = await request(app).get("/api/auth/me");

			expect(res.status).toBe(403);
		});

		it("should return 401 with invalid token", async () => {
			const res = await request(app)
				.get("/api/auth/me")
				.set("Cookie", "authenticationToken=invalid-token");

			expect(res.status).toBe(401);
		});
	});

	// --- LOGOUT ---

	describe("POST /api/auth/logout", () => {
		it("should clear cookie and return 200", async () => {
			const res = await request(app)
				.post("/api/auth/logout")
				.set("Cookie", getAuthCookie());

			expect(res.status).toBe(200);
			expect(res.body.message).toBe("Déconnexion réussie");
		});
	});

	// --- FORGOT PASSWORD ---

	describe("POST /api/auth/forgot-password", () => {
		it("should return generic message for existing email", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [{ id_user: 1, email: "test@test.com" }] })
				.mockResolvedValueOnce({ rows: [] }); // saveResetToken

			const res = await request(app)
				.post("/api/auth/forgot-password")
				.send({ email: "test@test.com" });

			expect(res.status).toBe(200);
			expect(res.body.message).toContain("réinitialisation");
		});

		it("should return same generic message for unknown email", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [] });

			const res = await request(app)
				.post("/api/auth/forgot-password")
				.send({ email: "unknown@test.com" });

			expect(res.status).toBe(200);
			expect(res.body.message).toContain("réinitialisation");
		});
	});

	// --- RESET PASSWORD ---

	describe("POST /api/auth/reset-password", () => {
		it("should reset password with valid token", async () => {
			const resetToken = jwt.sign({ email: "test@test.com" }, JWT_SECRET, { expiresIn: "1h" });

			mockQuery
				.mockResolvedValueOnce({ rows: [{ id_user: 1, email: "test@test.com", reset_token: resetToken }] })
				.mockResolvedValueOnce({ rows: [] }) // updatePasswordByEmail
				.mockResolvedValueOnce({ rows: [] }); // saveResetToken (invalidate)

			const res = await request(app)
				.post("/api/auth/reset-password")
				.send({ token: resetToken, password: "NewPassword1" });

			expect(res.status).toBe(200);
			expect(res.body.message).toContain("succès");
		});

		it("should return 400 with invalid token", async () => {
			const res = await request(app)
				.post("/api/auth/reset-password")
				.send({ token: "invalid-token", password: "NewPassword1" });

			expect(res.status).toBe(400);
		});

		it("should return 400 if token does not match stored token", async () => {
			const resetToken = jwt.sign({ email: "test@test.com" }, JWT_SECRET, { expiresIn: "1h" });

			mockQuery.mockResolvedValueOnce({
				rows: [{ id_user: 1, email: "test@test.com", reset_token: "different-token" }],
			});

			const res = await request(app)
				.post("/api/auth/reset-password")
				.send({ token: resetToken, password: "NewPassword1" });

			expect(res.status).toBe(400);
		});

		it("should return 400 if token and password missing", async () => {
			const res = await request(app)
				.post("/api/auth/reset-password")
				.send({});

			expect(res.status).toBe(400);
		});
	});
});
