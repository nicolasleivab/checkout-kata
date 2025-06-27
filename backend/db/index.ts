import Database from "better-sqlite3";
import { DB_FILE } from "../config";

const db = new Database(DB_FILE);

// Redundancy: ensure schema + seed at least once
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit_price INTEGER NOT NULL,
    offer_n INTEGER,
    offer_price INTEGER
  );

  INSERT OR IGNORE INTO products VALUES
    ('APPLE',  'Apple',  30, 2,  45),
    ('BANANA', 'Banana', 50, 3, 130),
    ('PEACH',  'Peach',  60, NULL, NULL),
    ('KIWI',   'Kiwi',   20, NULL, NULL);
`);

export default db;
