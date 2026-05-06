import { hashPassword, comparePassword } from "../../src/utils/password_utils";

describe("password_utils", () => {
	const plainPassword = "SecureP@ss1";

	describe("hashPassword", () => {
		it("should return a bcrypt hash", async () => {
			const hash = await hashPassword(plainPassword);
			expect(hash).toBeDefined();
			expect(hash).not.toBe(plainPassword);
			expect(hash.startsWith("$2a$") || hash.startsWith("$2b$")).toBe(true);
		});

		it("should produce different hashes for same input", async () => {
			const hash1 = await hashPassword(plainPassword);
			const hash2 = await hashPassword(plainPassword);
			expect(hash1).not.toBe(hash2);
		});
	});

	describe("comparePassword", () => {
		it("should return true for matching password", async () => {
			const hash = await hashPassword(plainPassword);
			const result = await comparePassword(plainPassword, hash);
			expect(result).toBe(true);
		});

		it("should return false for wrong password", async () => {
			const hash = await hashPassword(plainPassword);
			const result = await comparePassword("WrongP@ss1", hash);
			expect(result).toBe(false);
		});
	});
});
