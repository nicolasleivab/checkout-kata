import { jest } from "@jest/globals";
import { renderHook, act, waitFor } from "@testing-library/react";

const catalogue: TProductRow[] = [
  { sku: "APPLE", name: "Apple", unit_price: 30, offer_n: 2, offer_price: 45 },
  {
    sku: "BANANA",
    name: "Banana",
    unit_price: 50,
    offer_n: 3,
    offer_price: 130,
  },
  {
    sku: "KIWI",
    name: "Kiwi",
    unit_price: 20,
    offer_n: null,
    offer_price: null,
  },
  {
    sku: "PEACH",
    name: "Peach",
    unit_price: 60,
    offer_n: null,
    offer_price: null,
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(catalogue),
  } as Response)
) as any;

import { useProducts } from "../services/useProducts";
import { TProductRow } from "../../backend/models/product.model";

describe("useProducts", () => {
  it("loads catalogue and starts at zero", async () => {
    const { result } = renderHook(() => useProducts());

    await waitFor(() => expect(result.current.catalogue).toHaveLength(4));
    expect(result.current.total).toBe(0);
  });

  it("applies 2-for-45 discount on APPLE", async () => {
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.catalogue).toHaveLength(4));

    act(() => result.current.scan("APPLE"));
    act(() => result.current.scan("APPLE"));

    await waitFor(() => expect(result.current.total).toBe(45));
    expect(result.current.saved).toBe(15);
  });

  it("applies 3-for-130 discount on BANANA", async () => {
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.catalogue).toHaveLength(4));

    act(() => result.current.scan("BANANA"));
    act(() => result.current.scan("BANANA"));
    act(() => result.current.scan("BANANA"));

    await waitFor(() => expect(result.current.total).toBe(130));
    expect(result.current.saved).toBe(20);
  });

  it("applies any offer regardless of the scan order", async () => {
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.catalogue).toHaveLength(4));

    act(() => result.current.scan("BANANA"));
    act(() => result.current.scan("BANANA"));
    act(() => result.current.scan("APPLE"));
    act(() => result.current.scan("BANANA"));
    act(() => result.current.scan("KIWI"));
    act(() => result.current.scan("PEACH"));
    act(() => result.current.scan("APPLE"));

    await waitFor(() => expect(result.current.total).toBe(255));
    expect(result.current.saved).toBe(35);
  });
});
