import request from "supertest";
import app from "../app";

describe("GET /products", () => {
  it("returns 4 seeded products", async () => {
    const res = await request(app).get("/api/v1/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(4);
    expect(res.body[0]).toHaveProperty("sku");
  });
});
