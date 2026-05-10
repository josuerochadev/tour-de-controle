import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Set test environment
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";

// Mock Redis to avoid connection attempts during tests
jest.mock("ioredis", () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockRejectedValue(new Error("No Redis in tests")),
    set: jest.fn(),
    exists: jest.fn().mockResolvedValue(0),
    on: jest.fn(),
  }));
});
