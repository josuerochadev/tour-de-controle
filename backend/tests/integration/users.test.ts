import request from "supertest";
import { createTestApp } from "../helpers/app";
import { getAuthCookie } from "../helpers/auth";

jest.mock("../../src/config/db", () => ({
	__esModule: true,
	default: { query: jest.fn() },
}));

import pool from "../../src/config/db";

const mockQuery = pool.query as jest.Mock;
const app = createTestApp();

const adminCookie = getAuthCookie(1, 1); // role 1 = admin
const serverCookie = getAuthCookie(10, 4); // role 4 = serveur (non-admin)

const validUser = {
	first_name: "Jean",
	last_name: "Dupont",
	email: "jean@test.com",
	password: "Password1",
	hire_date: "2024-01-15",
	id_role: 3,
};

describe("User Endpoints", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// --- GET ALL ---

	describe("GET /api/users", () => {
		it("should return paginated users for admin", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [{ count: "2" }] })
				.mockResolvedValueOnce({
					rows: [
						{ id_user: 1, first_name: "Jean", last_name: "Dupont" },
						{ id_user: 2, first_name: "Marie", last_name: "Martin" },
					],
				});

			const res = await request(app)
				.get("/api/users")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("data");
			expect(res.body).toHaveProperty("total", 2);
			expect(res.body).toHaveProperty("page", 1);
			expect(res.body.data).toHaveLength(2);
		});

		it("should support pagination params", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [{ count: "50" }] })
				.mockResolvedValueOnce({ rows: [{ id_user: 11, first_name: "User" }] });

			const res = await request(app)
				.get("/api/users?page=2&limit=10")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(200);
			expect(res.body.page).toBe(2);
			expect(res.body.limit).toBe(10);
		});

		it("should return 403 for non-admin", async () => {
			const res = await request(app)
				.get("/api/users")
				.set("Cookie", serverCookie);

			expect(res.status).toBe(403);
		});

		it("should return 403 without auth", async () => {
			const res = await request(app).get("/api/users");
			expect(res.status).toBe(403);
		});
	});

	// --- GET BY ID ---

	describe("GET /api/users/:id", () => {
		it("should return a user by id", async () => {
			mockQuery.mockResolvedValueOnce({
				rows: [{ id_user: 1, first_name: "Jean", last_name: "Dupont", email: "jean@test.com" }],
			});

			const res = await request(app)
				.get("/api/users/1")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(200);
			expect(res.body.first_name).toBe("Jean");
		});

		it("should return 404 for unknown user", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [] });

			const res = await request(app)
				.get("/api/users/999")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(404);
		});

		it("should return 400 for invalid id", async () => {
			const res = await request(app)
				.get("/api/users/abc")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(400);
		});
	});

	// --- CREATE ---

	describe("POST /api/users", () => {
		it("should create a user with valid data", async () => {
			mockQuery.mockResolvedValueOnce({
				rows: [{ id_user: 3, ...validUser, password: "hashed" }],
			});

			const res = await request(app)
				.post("/api/users")
				.set("Cookie", adminCookie)
				.send(validUser);

			expect(res.status).toBe(201);
			expect(res.body.first_name).toBe("Jean");
		});

		it("should return 400 with missing required fields", async () => {
			const res = await request(app)
				.post("/api/users")
				.set("Cookie", adminCookie)
				.send({ first_name: "Jean" });

			expect(res.status).toBe(400);
		});

		it("should return 400 with weak password", async () => {
			const res = await request(app)
				.post("/api/users")
				.set("Cookie", adminCookie)
				.send({ ...validUser, password: "weak" });

			expect(res.status).toBe(400);
		});

		it("should return 400 with invalid email", async () => {
			const res = await request(app)
				.post("/api/users")
				.set("Cookie", adminCookie)
				.send({ ...validUser, email: "not-an-email" });

			expect(res.status).toBe(400);
		});
	});

	// --- UPDATE ---

	describe("PATCH /api/users/:id", () => {
		it("should update a user", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [{ id_user: 1, ...validUser }] }) // findById
				.mockResolvedValueOnce({ rows: [{ id_user: 1, first_name: "Pierre" }] }); // update

			const res = await request(app)
				.patch("/api/users/1")
				.set("Cookie", adminCookie)
				.send({ first_name: "Pierre" });

			expect(res.status).toBe(200);
		});

		it("should return 404 for unknown user", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [] });

			const res = await request(app)
				.patch("/api/users/999")
				.set("Cookie", adminCookie)
				.send({ first_name: "Pierre" });

			expect(res.status).toBe(404);
		});
	});

	// --- DELETE ---

	describe("DELETE /api/users/:id", () => {
		it("should delete a user", async () => {
			mockQuery
				.mockResolvedValueOnce({ rows: [{ id_user: 1 }] }) // findById
				.mockResolvedValueOnce({ rows: [] }); // remove

			const res = await request(app)
				.delete("/api/users/1")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(204);
		});

		it("should return 404 for unknown user", async () => {
			mockQuery.mockResolvedValueOnce({ rows: [] });

			const res = await request(app)
				.delete("/api/users/999")
				.set("Cookie", adminCookie);

			expect(res.status).toBe(404);
		});
	});
});
