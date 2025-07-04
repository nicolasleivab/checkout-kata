export const DEFAULT_BE_PORT = 3001;

export const PORT = Number(process.env.PORT ?? DEFAULT_BE_PORT);
export const DB_FILE = process.env.DB_FILE ?? "database.sqlite";

// CORS configuration
export const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
  : process.env.NODE_ENV === "production"
  ? ["https://yourdomain.com"] // Default production domain
  : [
      "http://localhost:5173", // Vite dev server+
    ];
