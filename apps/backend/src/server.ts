import http from "node:http";

import app from "./app";
import { env } from "./config/env";
import {
    disconnectRedis,
} from "./config/redis";
import {
    connectDatabase,
    disconnectDatabase,
} from "./db/prisma";
import { logger } from "./utils/logger";

let server: http.Server;

async function bootstrap(): Promise<void> {
    try {
        /*  External services */
        await connectDatabase();

        /*  HTTP Server */
        server = http.createServer(app);

        server.listen(env.PORT, () => {
            logger.info(
                {
                    port: env.PORT,
                    environment: env.NODE_ENV,
                },
                "HTTP server started",
            );
        });

        /*  Handle server errors */
        server.on("error", (error) => {
            logger.error({ err: error }, "HTTP server error");

            process.exit(1);
        });
    } catch (error) {
        logger.fatal({ err: error }, "Failed to start application");

        process.exit(1);
    }
}

/*  Graceful shutdown */
async function shutdown(signal: string): Promise<void> {
    logger.info({ signal }, "Shutdown signal received");

    if (!server) {
        await disconnectRedis();
        await disconnectDatabase();

        process.exit(0);
    }

    server.close(async () => {
        try {
            await disconnectRedis();
            await disconnectDatabase();

            logger.info("Application shutdown completed");

            process.exit(0);
        } catch (error) {
            logger.error(
                { err: error },
                "Error during application shutdown",
            );

            process.exit(1);
        }
    });

    /*  Force shutdown if connections don't close */
    setTimeout(() => {
        logger.error("Forced shutdown after timeout");

        process.exit(1);
    }, 10_000).unref();
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("uncaughtException", (error) => {
    logger.fatal({ err: error }, "Uncaught exception");

    void shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
    logger.fatal({ reason }, "Unhandled promise rejection");

    void shutdown("unhandledRejection");
});

/*  Star */
void bootstrap();