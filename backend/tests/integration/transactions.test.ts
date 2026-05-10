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

const adminCookie = getAuthCookie(1, 1);

const validTransaction = {
  amount: 45.5,
  tip: 5,
  id_payment_type: 1,
  id_cash_register: 1,
  created_by: 1,
};

describe("Transaction Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- GET ALL ---

  describe("GET /api/transactions", () => {
    it("should return paginated transactions", async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: "3" }] })
        .mockResolvedValueOnce({
          rows: [
            { id_transaction: 1, amount: 20 },
            { id_transaction: 2, amount: 30 },
            { id_transaction: 3, amount: 50 },
          ],
        });

      const res = await request(app)
        .get("/api/transactions")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body).toHaveProperty("total", 3);
      expect(res.body.data).toHaveLength(3);
    });

    it("should filter by date range", async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: "1" }] })
        .mockResolvedValueOnce({ rows: [{ id_transaction: 1, amount: 20 }] });

      const res = await request(app)
        .get("/api/transactions?date_from=2024-01-01&date_to=2024-12-31")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
    });

    it("should filter by payment type", async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ count: "1" }] })
        .mockResolvedValueOnce({
          rows: [{ id_transaction: 1, amount: 20, id_payment_type: 2 }],
        });

      const res = await request(app)
        .get("/api/transactions?payment_type=2")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
    });
  });

  // --- GET BY ID ---

  describe("GET /api/transactions/:id", () => {
    it("should return a transaction", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id_transaction: 1, amount: 45.5, tip: 5 }],
      });

      const res = await request(app)
        .get("/api/transactions/1")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body.amount).toBe(45.5);
    });

    it("should return 404 for unknown transaction", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get("/api/transactions/999")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(404);
    });
  });

  // --- CREATE ---

  describe("POST /api/transactions", () => {
    it("should create a transaction", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [{ id_transaction: 4, ...validTransaction }],
      });

      const res = await request(app)
        .post("/api/transactions")
        .set("Cookie", adminCookie)
        .send(validTransaction);

      expect(res.status).toBe(201);
      expect(res.body.amount).toBe(45.5);
    });

    it("should return 400 with negative amount", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Cookie", adminCookie)
        .send({ ...validTransaction, amount: -10 });

      expect(res.status).toBe(400);
    });

    it("should return 400 with missing fields", async () => {
      const res = await request(app)
        .post("/api/transactions")
        .set("Cookie", adminCookie)
        .send({ amount: 10 });

      expect(res.status).toBe(400);
    });
  });

  // --- UPDATE ---

  describe("PATCH /api/transactions/:id", () => {
    it("should update a transaction", async () => {
      mockQuery
        .mockResolvedValueOnce({
          rows: [
            {
              id_transaction: 1,
              amount: 45.5,
              tip: 5,
              id_cash_register: 1,
              id_payment_type: 1,
              created_by: 1,
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [{ id_transaction: 1, amount: 60, tip: 5 }],
        });

      const res = await request(app)
        .patch("/api/transactions/1")
        .set("Cookie", adminCookie)
        .send({ amount: 60 });

      expect(res.status).toBe(200);
    });

    it("should return 404 for unknown transaction", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .patch("/api/transactions/999")
        .set("Cookie", adminCookie)
        .send({ amount: 60 });

      expect(res.status).toBe(404);
    });
  });

  // --- DELETE ---

  describe("DELETE /api/transactions/:id", () => {
    it("should delete a transaction", async () => {
      mockQuery
        .mockResolvedValueOnce({ rows: [{ id_transaction: 1 }] })
        .mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete("/api/transactions/1")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(204);
    });

    it("should return 404 for unknown transaction", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .delete("/api/transactions/999")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(404);
    });
  });
});
