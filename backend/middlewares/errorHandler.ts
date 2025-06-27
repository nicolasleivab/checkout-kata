import { ErrorRequestHandler } from "express";

// Should be expanded when new routes are added with custom error handling and send res.status(status).json(body);
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
