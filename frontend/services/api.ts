import { TProductRow } from "../../backend/models/product.model";

const BASE = "http://localhost:3001/api/v1";

export async function getProducts() {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error("Failed fetching products");
  return (await res.json()) as TProductRow[];
}
