import { blacklistToken, isTokenBlacklisted } from "../../src/utils/token_blacklist_utils";

// Redis won't be available in tests, so we test the in-memory fallback
describe("token_blacklist (in-memory fallback)", () => {
	const testToken = "test-token-" + Date.now();

	it("should not be blacklisted initially", () => {
		const result = isTokenBlacklisted(testToken);
		expect(result).toBe(false);
	});

	it("should blacklist a token", async () => {
		await blacklistToken(testToken);
		const result = isTokenBlacklisted(testToken);
		expect(result).toBe(true);
	});

	it("should not affect other tokens", () => {
		const result = isTokenBlacklisted("other-token");
		expect(result).toBe(false);
	});
});
