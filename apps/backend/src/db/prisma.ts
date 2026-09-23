import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";

export const prisma = new PrismaClient({
    log:
        process.env.NODE_ENV === "development"
            ? ["query", "info", "warn", "error"]
            : ["warn", "error"],
});

export async function connectDatabase(): Promise<void> {
    await prisma.$connect();

    logger.info("PostgreSQL connected");
}

export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();

    logger.info("PostgreSQL disconnected");
}