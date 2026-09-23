import { Worker } from "bullmq";

import { env } from "./config/env";
import { logger } from "./utils/logger";

const worker = new Worker(
    "default",
    async (job) => {
        logger.info(
            {
                jobId: job.id,
                jobName: job.name,
            },
            "Processing job",
        );

        switch (job.name) {
            case "send-email":
                // await emailService.send(...)
                break;

            case "process-booking":
                // await bookingService.process(...)
                break;

            case "generate-report":
                // await reportService.generate(...)
                break;

            default:
                logger.warn(
                    {
                        jobName: job.name,
                    },
                    "Unknown job",
                );
        }
    },
    {
        connection: {
            url: env.REDIS_URL,
        },

        concurrency: 10,

        limiter: {
            max: 100,
            duration: 1000,
        },
    },
);

worker.on("ready", () => {
    logger.info("Worker ready");
});

worker.on("completed", (job) => {
    logger.info(
        {
            jobId: job.id,
            jobName: job.name,
        },
        "Job completed",
    );
});

worker.on("failed", (job, error) => {
    logger.error(
        {
            jobId: job?.id,
            jobName: job?.name,
            err: error,
        },
        "Job failed",
    );
});

worker.on("error", (error) => {
    logger.error(
        {
            err: error,
        },
        "Worker error",
    );
});

/*
|--------------------------------------------------------------------------
| Graceful shutdown
|--------------------------------------------------------------------------
*/

async function shutdown(signal: string): Promise<void> {
    logger.info({ signal }, "Worker shutdown started");

    try {
        await worker.close();

        logger.info("Worker shutdown completed");

        process.exit(0);
    } catch (error) {
        logger.error(
            {
                err: error,
            },
            "Worker shutdown failed",
        );

        process.exit(1);
    }
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("uncaughtException", (error) => {
    logger.fatal({ err: error }, "Worker uncaught exception");

    void shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
    logger.fatal(
        {
            reason,
        },
        "Worker unhandled rejection",
    );

    void shutdown("unhandledRejection");
});