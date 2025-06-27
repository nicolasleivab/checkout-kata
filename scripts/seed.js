// One-off CLI to (re)seed the database with sample products.

import Database from "better-sqlite3";
const db = new Database("database.sqlite");

db.exec(`
  DROP TABLE IF EXISTS products;
  CREATE TABLE products (
    sku TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    unit_price INTEGER NOT NULL,
    offer_n INTEGER,
    offer_price INTEGER
  );

  INSERT INTO products VALUES
    ('APPLE',  'Apple',  30, 2,  45),
    ('BANANA', 'Banana', 50, 3, 130),
    ('PEACH',  'Peach',  60, NULL, NULL),
    ('KIWI',   'Kiwi',   20, NULL, NULL);
`);

console.log("✅  database seeded");
