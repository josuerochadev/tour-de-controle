import { describe, it, expect } from "vitest";
import {
	ROLES,
	ROLE_LABELS,
	ADMIN_ROLES,
	PAYMENT_TYPE_FALLBACK,
	TOAST_DURATION_MS,
	DASHBOARD_RECENT_LIMIT,
	formatTodayDate,
	formatDateToISO,
} from "../constants";

describe("constants", () => {
	describe("ROLES", () => {
		it("should have 4 roles", () => {
			expect(Object.keys(ROLES)).toHaveLength(4);
		});

		it("should have unique IDs", () => {
			const ids = Object.values(ROLES);
			expect(new Set(ids).size).toBe(ids.length);
		});
	});

	describe("ROLE_LABELS", () => {
		it("should have a label for each role", () => {
			for (const id of Object.values(ROLES)) {
				expect(ROLE_LABELS[id]).toBeDefined();
				expect(typeof ROLE_LABELS[id]).toBe("string");
			}
		});
	});

	describe("ADMIN_ROLES", () => {
		it("should contain DEVELOPER and MANAGER", () => {
			expect(ADMIN_ROLES).toContain(ROLES.DEVELOPER);
			expect(ADMIN_ROLES).toContain(ROLES.MANAGER);
		});

		it("should not contain SERVER", () => {
			expect(ADMIN_ROLES).not.toContain(ROLES.SERVER);
		});
	});

	describe("PAYMENT_TYPE_FALLBACK", () => {
		it("should have 6 payment types", () => {
			expect(Object.keys(PAYMENT_TYPE_FALLBACK)).toHaveLength(6);
		});
	});

	describe("TOAST_DURATION_MS", () => {
		it("should be a positive number", () => {
			expect(TOAST_DURATION_MS).toBeGreaterThan(0);
		});
	});

	describe("DASHBOARD_RECENT_LIMIT", () => {
		it("should be a positive number", () => {
			expect(DASHBOARD_RECENT_LIMIT).toBeGreaterThan(0);
		});
	});

	describe("formatTodayDate", () => {
		it("should return YYYY-MM-DD format", () => {
			const result = formatTodayDate();
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		});

		it("should return today's date", () => {
			const today = new Date().toISOString().split("T")[0];
			expect(formatTodayDate()).toBe(today);
		});
	});

	describe("formatDateToISO", () => {
		it("should format a Date string to YYYY-MM-DD", () => {
			expect(formatDateToISO("2024-06-15T12:00:00Z")).toBe("2024-06-15");
		});

		it("should format a Date object", () => {
			const date = new Date("2024-01-01");
			expect(formatDateToISO(date)).toBe("2024-01-01");
		});
	});
});
