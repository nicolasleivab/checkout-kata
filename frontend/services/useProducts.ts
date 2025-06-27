import { useState } from "react";
import { getProducts } from "./api";
import { TProductRow } from "../../backend/models/product.model.js";
import { useQuery } from "@tanstack/react-query";

type TTotals = { total: number; saved: number };
const PRODUCTS_QK = ["products"];

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
  const [total, setTotal] = useState(0);
  const [saved, setSaved] = useState(0);

  const scan = (sku: string) =>
    setCart((prev) => {
      const next = { ...prev, [sku]: (prev[sku] ?? 0) + 1 };
      const totals = calculateTotals(next, catalogue);

      setTotal(totals.total);
      setSaved(totals.saved);

      return next;
    });

  const pay = () => {
    setCart({});
    setTotal(0);
    setSaved(0);
  };

  return { catalogue, cart, total, saved, scan, pay };
}
