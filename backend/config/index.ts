export const DEFAULT_BE_PORT = 3001;

export const PORT = Number(process.env.PORT ?? DEFAULT_BE_PORT);
export const DB_FILE = process.env.DB_FILE ?? "database.sqlite";
