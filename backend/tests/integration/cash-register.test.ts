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

describe("Cash Register Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE (OPEN) ---

  describe("POST /api/cash-registers", () => {
    it("should open a new cash register", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id_cash_register: 1,
            date_opened: new Date(),
            physical_amount: 0,
            theoretical_amount: 0,
            status: "OPEN",
            opened_by: 1,
          },
        ],
      });

      const res = await request(app)
        .post("/api/cash-registers")
        .set("Cookie", adminCookie)
        .send({ id_restaurant: 1 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("OPEN");
      expect(res.body.physical_amount).toBe(0);
      expect(res.body.opened_by).toBe(1);
    });

    it("should return 403 without auth", async () => {
      const res = await request(app)
        .post("/api/cash-registers")
        .send({ id_restaurant: 1 });

      expect(res.status).toBe(403);
    });
  });

  // --- CURRENT ---

  describe("GET /api/cash-registers/current", () => {
    it("should return open cash registers", async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [
          { id_cash_register: 1, status: "OPEN", opened_by: 1 },
          { id_cash_register: 2, status: "OPEN", opened_by: 2 },
        ],
      });

      const res = await request(app)
        .get("/api/cash-registers/current")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].status).toBe("OPEN");
    });

    it("should return empty array when no open registers", async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const res = await request(app)
        .get("/api/cash-registers/current")
        .set("Cookie", adminCookie);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(0);
    });
  });

  // --- CLOSE ---

  describe("PUT /api/cash-registers/:id/close", () => {
    const closeFunds = {
      funds: [
        { id_payment_type: 1, physical_amount: 100 },
        { id_payment_type: 2, physical_amount: 50 },
      ],
    };

    it("should close register without gap", async () => {
      // findById query (ownership check)
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id_cash_register: 1,
            status: "OPEN",
            opened_by: 1,
          },
        ],
      });
      // transactions query
      mockQuery.mockResolvedValueOnce({
        rows: [
          { amount: 100, id_payment_type: 1 },
          { amount: 50, id_payment_type: 2 },
        ],
      });
      // update query
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id_cash_register: 1,
            status: "CLOSED",
            has_gap: false,
            physical_amount: 150,
            theoretical_amount: 150,
            closed_by: 1,
          },
        ],
      });

      const res = await request(app)
        .put("/api/cash-registers/1/close")
        .set("Cookie", adminCookie)
        .send(closeFunds);

      expect(res.status).toBe(200);
      expect(res.body.hasGap).toBe(false);
      expect(res.body.message).toContain("succès");
    });

    it("should close register and report gap", async () => {
      // findById query (ownership check)
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id_cash_register: 1,
            status: "OPEN",
            opened_by: 1,
          },
        ],
      });
      // transactions query - theoretical = 200
      mockQuery.mockResolvedValueOnce({
        rows: [
          { amount: 120, id_payment_type: 1 },
          { amount: 80, id_payment_type: 2 },
        ],
      });
      // update query
      mockQuery.mockResolvedValueOnce({
        rows: [
          {
            id_cash_register: 1,
            status: "CLOSED",
            has_gap: true,
            physical_amount: 150,
            theoretical_amount: 200,
            closed_by: 1,
          },
        ],
      });

      const res = await request(app)
        .put("/api/cash-registers/1/close")
        .set("Cookie", adminCookie)
        .send(closeFunds);

      expect(res.status).toBe(200);
      expect(res.body.hasGap).toBe(true);
      expect(res.body.message).toContain("écart");
    });

    it("should return 400 with invalid body", async () => {
      const res = await request(app)
        .put("/api/cash-registers/1/close")
        .set("Cookie", adminCookie)
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
