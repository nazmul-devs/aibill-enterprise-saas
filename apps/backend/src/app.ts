import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { env, isProduction } from "./config/env";
import routes from "./routes";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/error.middleware";

const app: Express = express();



/* Security */

app.disable("x-powered-by");

app.use(
    helmet({
        contentSecurityPolicy: isProduction,
    }),
);

/* CORS */

const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) =>
    origin.trim(),
);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

/* Request parsing */

app.use(
    express.json({
        limit: "1mb",
    }),
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb",
    }),
);

/* Compression */

app.use(compression());

/* Rate limiting */

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

app.use("/api", limiter);

/* Routes */

app.use("/api", routes);

/* Error handling */

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
