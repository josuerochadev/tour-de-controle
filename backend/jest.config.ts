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
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts"],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
