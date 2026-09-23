import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
    // App

    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    PORT: z.coerce.number().int().positive().default(5000),

    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

    JWT_EXPIRES_IN: z.string().default("15m"),

    CORS_ORIGIN: z
        .string()
        .min(1)
        .default("http://localhost:5173"),

    // Database

    POSTGRES_USER: z.string().min(1),

    POSTGRES_PASSWORD: z.string().min(1),

    POSTGRES_DB: z.string().min(1),

    DATABASE_URL: z
        .string()
        .url()
        .refine(
            (value) => value.startsWith("postgresql://"),
            "DATABASE_URL must be a PostgreSQL connection URL",
        ),

    // Redis

    REDIS_URL: z
        .string()
        .url()
        .default("redis://localhost:6379"),

    // AI

    ANTHROPIC_API_KEY: z.string().optional(),

    AI_MODEL: z
        .string()
        .default("claude-sonnet-5"),

    // Mail

    SMTP_HOST: z.string().optional(),

    SMTP_PORT: z.coerce
        .number()
        .int()
        .positive()
        .default(587),

    SMTP_USER: z.string().optional(),

    SMTP_PASS: z.string().optional(),

    MAIL_FROM: z
        .string()
        .default("Invoices <no-reply@example.com>"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
    console.error("\n❌ Invalid environment variables:\n");

    console.error(
        result.error.issues
            .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
            .join("\n"),
    );

    console.error("");

    process.exit(1);
}

export const env = result.data;

export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";