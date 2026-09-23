import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  logger.error(
    {
      err: error,
      method: req.method,
      url: req.originalUrl,
    },
    "Unhandled application error",
  );

  // Zod validation error
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten(),
    });
  }

  // Default error
  const statusCode =
    typeof error.statusCode === "number" ? error.statusCode : 500;

  const message =
    statusCode >= 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};