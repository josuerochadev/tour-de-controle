/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/tests/**/*.test.ts"],
	modulePaths: ["<rootDir>/src"],
	setupFiles: ["<rootDir>/tests/setup.ts"],
	transform: {
		"^.+\\.ts$": ["ts-jest", { isolatedModules: true }],
	},
};
