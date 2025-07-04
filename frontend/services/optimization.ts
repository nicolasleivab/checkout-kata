export const SKUS = ["APPLE", "BANANA", "PEACH", "KIWI"] as const;
export type TSku = (typeof SKUS)[number];
export type TReceiptLine = { desc: string; cents: number };

export type TProductRow = {
  sku: TSku;
  name: string;
  unit_price: number; // cents
  offer_n: number | null;
  offer_price: number | null;
};

const CATALOGUE: TProductRow[] = [
  { sku: "APPLE", name: "Apple", unit_price: 30, offer_n: 2, offer_price: 45 },
  {
    sku: "BANANA",
    name: "Banana",
    unit_price: 50,
    offer_n: 3,
    offer_price: 130,
  },
  {
    sku: "PEACH",
    name: "Peach",
    unit_price: 60,
    offer_n: null,
    offer_price: null,
  },
  {
    sku: "KIWI",
    name: "Kiwi",
    unit_price: 20,
    offer_n: null,
    offer_price: null,
  },
];

const receipt: TReceiptLine[] = [];
const groupedBySku: Record<string, TProductRow> = CATALOGUE.reduce(
  (acc, item) => {
    acc[item.sku] = item;
    return acc;
  },
  {} as Record<string, TProductRow>
);

type TCartItem = { qty: number; value: number; saved: number };
type TCart = Record<TSku, TCartItem>;
const cart: TCart = {} as TCart;

// O(1) Scan
const scan = (fruit: TSku) => {
  const currentItem = cart[fruit];
  const catalogue = groupedBySku[fruit];

  if (!currentItem) {
    cart[fruit] = {
      qty: 1,
      value: catalogue.unit_price,
      saved: catalogue.offer_n === 1 ? catalogue.offer_price! : 0,
    };
    receipt.push({ desc: catalogue.name, cents: catalogue.unit_price });
  } else {
    const newQty = currentItem.qty + 1;

    if (catalogue.offer_n && catalogue.offer_price) {
      // Calculate total value for the new quantity
      const bundles = Math.floor(newQty / catalogue.offer_n);
      const singles = newQty % catalogue.offer_n;
      const totalValue =
        bundles * catalogue.offer_price + singles * catalogue.unit_price;
      const totalSaved = newQty * catalogue.unit_price - totalValue;
      cart[fruit] = { qty: newQty, value: totalValue, saved: totalSaved };

      receipt.push({ desc: catalogue.name, cents: catalogue.unit_price });
      const isCurrentItemDiscounted = singles === 0;
      if (isCurrentItemDiscounted)
        receipt.push({
          desc: catalogue.name,
          cents:
            catalogue.offer_price - catalogue.unit_price * catalogue.offer_n,
        });
    } else {
      // No offer, just add unit price
      cart[fruit] = {
        qty: newQty,
        value: currentItem.value + catalogue.unit_price,
        saved: 0,
      };
      receipt.push({ desc: catalogue.name, cents: catalogue.unit_price });
    }
  }
};
