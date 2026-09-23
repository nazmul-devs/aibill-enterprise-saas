import Redis from "ioredis";
import { logger } from "../utils/logger";
import { env } from "./env";

export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
});

redis.on("connect", () => {
    logger.info("Redis connecting...");
});

redis.on("ready", () => {
    logger.info("Redis connected");
});

redis.on("error", (error) => {
    logger.error({ err: error }, "Redis error");
});

redis.on("close", () => {
    logger.warn("Redis connection closed");
});

export async function disconnectRedis(): Promise<void> {
    await redis.quit();

    logger.info("Redis disconnected");
}