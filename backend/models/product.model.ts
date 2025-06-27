import db from "../db";

export const SKUS = ["APPLE", "BANANA", "PEACH", "KIWI"] as const;
export type TSku = (typeof SKUS)[number];

export type TProductRow = {
  sku: TSku;
  name: string;
  unit_price: number; // cents
  offer_n: number | null;
  offer_price: number | null;
};

export type TNoParams = never[];

// This query takes NO parameters, pagination can be added later if needed
const selectAll = db.prepare<TNoParams, TProductRow>("SELECT * FROM products");

export function findAll(): TProductRow[] {
  return selectAll.all();
}

// Mutations (currently unused)
// can be used for mutations later

export type TUpdatePriceOfferParams = {
  unit_price: number; // in cents
  offer_n: number | null;
  offer_price: number | null;
  sku: TSku;
};

const updatePriceOffer = db.prepare<TUpdatePriceOfferParams>(`
  UPDATE products
     SET unit_price  = @unit_price,
         offer_n     = @offer_n,
         offer_price = @offer_price
   WHERE sku         = @sku
`);

export function setPriceAndOffer(
  sku: TSku,
  fields: Pick<TProductRow, "unit_price" | "offer_n" | "offer_price">
): void {
  updatePriceOffer.run({ ...fields, sku });
}
