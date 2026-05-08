import Redis from "ioredis";
import logger from "../config/logger";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

let redisAvailable = false;

// In-memory fallback when Redis is unavailable
const memoryBlacklist = new Set<string>();

redis
  .connect()
  .then(() => {
    redisAvailable = true;
  })
  .catch(() => {
    logger.warn("Redis unavailable, using in-memory token blacklist");
  });

export async function blacklistToken(token: string, expiresInSeconds = 3600) {
  if (redisAvailable) {
    await redis.set(`bl:${token}`, "1", "EX", expiresInSeconds);
  } else {
    memoryBlacklist.add(token);
  }
}

export function isTokenBlacklisted(token: string): boolean | Promise<boolean> {
  if (redisAvailable) {
    return redis.exists(`bl:${token}`).then((result) => result === 1);
  }
  return memoryBlacklist.has(token);
}
