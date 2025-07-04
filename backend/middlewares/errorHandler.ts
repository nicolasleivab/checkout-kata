import { ErrorRequestHandler } from "express";

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Helper function to create custom error responses
export const createErrorResponse = (statusCode: number, message: string) => {
  return { error: message };
};

// Should be expanded when new routes are added with custom error handling and send res.status(status).json(body);
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  // Handle custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Handle validation errors (from express-validator or similar)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: err.message || "Validation failed",
    });
  }

  // Handle database errors
  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(400).json({
      error: "Database constraint violation",
    });
  }

  // Default error response
  res.status(500).json({ error: "Internal server error" });
};
