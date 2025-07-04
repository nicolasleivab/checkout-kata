import { performance } from "perf_hooks";
import { act, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";

import { renderHookWithClient } from "../utils";
import { useProductsOptimized } from "../services/useProductsOptimized";
import { useProducts } from "../services/useProducts";
import type { TProductRow } from "../../backend/models/product.model";

// Reduced catalogue to the 2 products with offers
const catalogue: TProductRow[] = [
  { sku: "APPLE", name: "Apple", unit_price: 30, offer_n: 2, offer_price: 45 },
  {
    sku: "BANANA",
    name: "Banana",
    unit_price: 50,
    offer_n: 3,
    offer_price: 130,
  },
];
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(catalogue),
  } as Response)
) as any;

// helper to time N scans of "APPLE"
const bench = async (hookFactory: () => any, batchSizes: number[]) => {
  const { result } = renderHookWithClient(hookFactory);
  await waitFor(() => expect(result.current.catalogue).toHaveLength(2));

  const totals: number[] = []; // total ms for each batch
  const msPerScan: number[] = [];

  for (const n of batchSizes) {
    act(() => result.current.pay?.()); // reset if API exists
    const t0 = performance.now();
    act(() => {
      for (let i = 0; i < n; i++) result.current.scan("APPLE");
    });
    const ms = performance.now() - t0;
    totals.push(ms);
    msPerScan.push(ms / n);
  }
  return { totals, msPerScan };
};

describe("O(1) vs O(n) scan benchmark", () => {
  jest.setTimeout(30_000);

  const batches = [5_000, 10_000, 20_000];
  // const batches = [25_000, 50_000, 100_000];

  it("optimised stays flat; original slows down", async () => {
    const opt = await bench(() => useProductsOptimized(), batches);
    const orig = await bench(() => useProducts(), batches);

    // Assertions
    // 1. Optimised per-scan time should not grow more than 50 %
    expect(opt.msPerScan[2]).toBeLessThan(opt.msPerScan[0] * 1.5);

    // 2. Original should be at least twice as slow for the largest batch (generous threshold, the larger the batch the slower the original will be)
    expect(orig.msPerScan[2]).toBeGreaterThan(opt.msPerScan[2] * 2);

    console.table(
      batches.map((n, i) => ({
        batch: n,
        "opt ms": opt.totals[i].toFixed(2),
        "opt /scan": opt.msPerScan[i].toFixed(4),
        "orig ms": orig.totals[i].toFixed(2),
        "orig /scan": orig.msPerScan[i].toFixed(4),
      }))
    );
  });
});
