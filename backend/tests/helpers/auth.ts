import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

export function generateTestToken(userId = 1, role = 1) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
}

export function getAuthCookie(userId = 1, role = 1) {
  const token = generateTestToken(userId, role);
  return `authenticationToken=${token}`;
}
