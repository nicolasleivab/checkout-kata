import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./api";
import type { TProductRow, TSku } from "../../backend/models/product.model.js";

const PRODUCTS_QK = ["products"];
export type TReceiptLine = { desc: string; cents: number };

type TCartItem = { qty: number; value: number; saved: number };

export function useProductsOptimized() {
  // Catalogue + O(1) lookup table
  const { data: catalogue = [] } = useQuery<TProductRow[]>({
    queryKey: PRODUCTS_QK,
    queryFn: getProducts,
    staleTime: 60_000,
  });

  const lookup = useMemo(
    () =>
      Object.fromEntries(catalogue.map((p) => [p.sku, p])) as Record<
        TSku,
        TProductRow
      >,
    [catalogue]
  );

  // Mutable refs for cart & receipt  (no full copies)
  const cartRef = useRef(new Map<TSku, TCartItem>());
  const receiptRef = useRef<TReceiptLine[]>([]);

  const [{ total, saved }, setTotals] = useState({ total: 0, saved: 0 });
  const [, forceUpdate] = useState(0); // bump to re-render

  // O(1) scan
  const scan = (sku: TSku) => {
    const product = lookup[sku];
    if (!product) return; // unknown SKU guard

    const cart = cartRef.current;
    const entry = cart.get(sku);

    let newItem: TCartItem;
    let deltaValue = 0;
    let deltaSaved = 0;

    // build / update the cart line
    if (!entry) {
      // irst time we see this SKU
      const firstValue =
        product.offer_n === 1 && product.offer_price != null
          ? product.offer_price
          : product.unit_price;

      deltaValue = firstValue;
      deltaSaved = product.unit_price - firstValue;

      newItem = { qty: 1, value: firstValue, saved: deltaSaved };
    } else {
      const newQty = entry.qty + 1;

      if (product.offer_n && product.offer_price) {
        const bundles = Math.floor(newQty / product.offer_n);
        const singles = newQty % product.offer_n;

        const newValue =
          bundles * product.offer_price + singles * product.unit_price;
        const newSaved = newQty * product.unit_price - newValue;

        deltaValue = newValue - entry.value;
        deltaSaved = newSaved - entry.saved;

        newItem = { qty: newQty, value: newValue, saved: newSaved };
      } else {
        deltaValue = product.unit_price;
        newItem = {
          qty: newQty,
          value: entry.value + product.unit_price,
          saved: entry.saved,
        };
      }
    }

    cart.set(sku, newItem);

    // update running totals in O(1)
    setTotals(({ total, saved }) => ({
      total: total + deltaValue,
      saved: saved + deltaSaved,
    }));

    // append receipt lines
    receiptRef.current.push({ desc: product.name, cents: product.unit_price });
    if (deltaSaved > 0) {
      receiptRef.current.push({
        desc: `${product.name} discount`,
        cents: -deltaSaved,
      });
    }

    // trigger re-render
    forceUpdate((v) => v + 1);
  };

  const pay = () => {
    cartRef.current.clear();
    receiptRef.current.length = 0;
    setTotals({ total: 0, saved: 0 });
    forceUpdate((v) => v + 1);
  };

  return {
    catalogue,
    cart: cartRef.current, // Map<TSku, TCartItem>
    receipt: receiptRef.current,
    total,
    saved,
    scan,
    pay,
  };
}
