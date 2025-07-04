// Frontend-only product types to avoid importing backend dependencies
export const SKUS = ["APPLE", "BANANA", "PEACH", "KIWI"] as const;
export type TSku = (typeof SKUS)[number];

export type TProductRow = {
  sku: TSku;
  name: string;
  unit_price: number; // cents
  offer_n: number | null;
  offer_price: number | null;
};

export type TUpdatePriceOfferParams = {
  unit_price: number; // in cents
  offer_n: number | null;
  offer_price: number | null;
  sku: TSku;
};
