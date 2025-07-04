import { TProductRow, TUpdatePriceOfferParams } from "../types/products";

const BASE = "http://localhost:3001/api/v1";

export async function getProducts() {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error("Failed fetching products");
  return (await res.json()) as TProductRow[];
}

export async function updateProductPricing(
  sku: string,
  data: Omit<TUpdatePriceOfferParams, "sku">,
  authToken?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE}/products/${sku}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return (await res.json()) as { message: string; updatedBy: string };
}
