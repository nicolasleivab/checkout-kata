import { useProductsOptimized } from "../../services/useProductsOptimized";
import {
  ProductCard,
  Receipt,
  Summary,
  ProductPricingForm,
} from "../components";
import { CartProvider } from "../../contexts/CartContext";
import styles from "./Checkout.module.css";

export default function Checkout() {
  const { catalogue, scan, total, saved, receipt, pay } =
    useProductsOptimized();

  return (
    <CartProvider clearCart={pay}>
      <main style={{ fontFamily: "sans-serif", padding: 24 }}>
        <h1>🏷️ Checkout</h1>

        <ProductPricingForm />

        <section className={styles.grid}>
          {catalogue.map((p) => (
            <ProductCard
              key={p.sku}
              sku={p.sku}
              name={p.name}
              priceCents={p.unit_price}
              onClick={() => scan(p.sku)}
            />
          ))}
        </section>

        <Summary total={total} saved={saved} />

        <Receipt receipt={receipt} pay={pay} />
      </main>
    </CartProvider>
  );
}
