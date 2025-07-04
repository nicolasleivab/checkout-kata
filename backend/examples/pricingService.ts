// import express, { Request, Response } from "express";

// type CartLine = { qty: number; value: number; saved: number };
// type Cart = Map<string, CartLine>; // keyed by SKU
// type Delta = {
//   total: number;
//   saved: number;
//   lines: { desc: string; cents: number }[];
// };

// const catalogue = {
//   APPLE: { name: "Apple", unit: 30, offerN: 2, offerPrice: 45 },
//   BANANA: { name: "Banana", unit: 50, offerN: 3, offerPrice: 130 },
//   PEACH: { name: "Peach", unit: 60 },
//   KIWI: { name: "Kiwi", unit: 20 },
// } as const;

// const carts = new Map<string, Cart>(); // <cartId, cart>

// const app = express();
// app.use(express.json());

// app.post("/cart/:id/scan", (req: Request, res: Response<Delta>) => {
//   const { sku } = req.body as { sku: string };
//   const cartId = req.params.id;
//   const product = catalogue[sku as keyof typeof catalogue];

//   if (!product) return res.status(400).send({ error: "Unknown SKU" } as any);

//   /* ---------- fetch / init cart ---------- */
//   let cart = carts.get(cartId);
//   if (!cart) {
//     cart = new Map();
//     carts.set(cartId, cart);
//   }

//   /* ---------- update exactly one line ---- */
//   let line = cart.get(sku);
//   if (!line) line = { qty: 0, value: 0, saved: 0 };

//   line.qty += 1;

//   if (product.offerN && product.offerPrice) {
//     const bundles = Math.floor(line.qty / product.offerN);
//     const singles = line.qty % product.offerN;
//     const newValue = bundles * product.offerPrice + singles * product.unit;
//     const newSaved = line.qty * product.unit - newValue;
//     line.value = newValue;
//     line.saved = newSaved;
//   } else {
//     line.value += product.unit;
//   }

//   cart.set(sku, line);

//   /* ---------- build delta for the client -- */
//   const deltaTotal =
//     line.value - (line.qty === 1 ? 0 : line.value - product.unit);
//   const deltaSaved = line.saved - (line.qty === 1 ? 0 : line.saved);

//   res.json({
//     total: deltaTotal,
//     saved: deltaSaved,
//     lines: [
//       { desc: product.name, cents: product.unit },
//       ...(deltaSaved > 0
//         ? [{ desc: `${product.name} discount`, cents: -deltaSaved }]
//         : []),
//     ],
//   });
// });

// app.listen(4000, () => console.log("Pricing API on http://localhost:4000"));
