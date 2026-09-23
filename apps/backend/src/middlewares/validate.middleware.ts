import { RequestHandler } from "express";
import { ZodType } from "zod";

export const validate = (
    schema: ZodType,
    source: "body" | "query" | "params" = "body",
): RequestHandler => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.flatten(),
            });
        }

        req[source] = result.data;

        next();
    };
};