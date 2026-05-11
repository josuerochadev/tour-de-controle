import Redis from "ioredis";
import logger from "../config/logger";

// In-memory fallback when Redis is unavailable
const memoryBlacklist = new Set<string>();

let redis: Redis | null = null;
let redisAvailable = false;

// Only attempt Redis connection when a URL is explicitly configured
if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  redis
    .connect()
    .then(() => {
      redisAvailable = true;
    })
    .catch(() => {
      logger.warn("Redis unavailable, using in-memory token blacklist");
    });
} else {
  logger.warn("REDIS_URL not set, using in-memory token blacklist");
}

export async function blacklistToken(token: string, expiresInSeconds = 3600) {
  if (redisAvailable && redis) {
    await redis.set(`bl:${token}`, "1", "EX", expiresInSeconds);
  } else {
    memoryBlacklist.add(token);
  }
}

export function isTokenBlacklisted(token: string): boolean | Promise<boolean> {
  if (redisAvailable && redis) {
    return redis.exists(`bl:${token}`).then((result) => result === 1);
  }
  return memoryBlacklist.has(token);
}
