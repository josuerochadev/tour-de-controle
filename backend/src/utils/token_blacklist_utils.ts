import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(REDIS_URL, {
	maxRetriesPerRequest: 3,
	lazyConnect: true,
});

let redisAvailable = false;

// Fallback en mémoire si Redis n'est pas disponible
const memoryBlacklist = new Set<string>();

redis
	.connect()
	.then(() => {
		redisAvailable = true;
	})
	.catch(() => {
		console.warn("Redis unavailable, using in-memory token blacklist (not suitable for production)");
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
