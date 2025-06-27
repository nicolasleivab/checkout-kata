import { useState } from "react";
import { getProducts } from "./api";
import { TProductRow } from "../../backend/models/product.model.js";
import { useQuery } from "@tanstack/react-query";

type TTotals = { total: number; saved: number };
const PRODUCTS_QK = ["products"];
export type TReceiptLine = { desc: string; cents: number };

function calculateTotals(
  cart: Record<string, number>,
  catalogue: TProductRow[]
): TTotals {
  const lookup = Object.fromEntries(catalogue.map((p) => [p.sku, p])) as Record<
    string,
    TProductRow
  >;

  return Object.entries(cart).reduce<TTotals>(
    (acc, [sku, qty]) => {
      const { unit_price, offer_n, offer_price } = lookup[sku];

      const regularCost = qty * unit_price;

      let discountedCost = regularCost;
      if (offer_n && offer_price) {
        const bundles = Math.floor(qty / offer_n);
        const singles = qty % offer_n;
        discountedCost = bundles * offer_price + singles * unit_price;
      }

      acc.total += discountedCost;
      acc.saved += regularCost - discountedCost;
      return acc;
    },
    { total: 0, saved: 0 }
  );
}

export function useProducts() {
  const {
    data: catalogue = [],
    isLoading, // Can be used for a loading mask
    error, // For future implementation of toasts
  } = useQuery<TProductRow[]>({
    queryKey: PRODUCTS_QK,
    queryFn: getProducts,
    staleTime: 60_000, // 1 min for now. Later we can invalidate this cache by introducing mutations to the project
  });

  const [cart, setCart] = useState<Record<string, number>>({});
  const [receipt, setReceipt] = useState<TReceiptLine[]>([]);
  const [total, setTotal] = useState(0);
  const [saved, setSaved] = useState(0);

  const scan = (sku: string) =>
    setCart((prev) => {
      const beforeTotals = calculateTotals(prev, catalogue);

      const next = { ...prev, [sku]: (prev[sku] ?? 0) + 1 };
      const afterTotals = calculateTotals(next, catalogue);

      setTotal(afterTotals.total);
      setSaved(afterTotals.saved);

      const item = catalogue.find((p) => p.sku === sku)!;
      const lines: TReceiptLine[] = [
        { desc: item.name, cents: item.unit_price },
      ];

      const delta = afterTotals.total - beforeTotals.total; // what customer actually paid
      const discountCents = item.unit_price - delta;
      if (discountCents > 0) {
        lines.push({ desc: `${item?.name} discount`, cents: -discountCents });
      }

      setReceipt((old) => [...old, ...lines]);
      return next;
    });

  const pay = () => {
    setCart({});
    setReceipt([]);
    setTotal(0);
    setSaved(0);
  };

  return { catalogue, cart, total, saved, scan, receipt, pay };
}
