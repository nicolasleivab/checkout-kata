import { useProducts } from "../../services/useProducts";
import { ProductCard, Receipt, Summary } from "../components";
import styles from "./Checkout.module.css";

export default function Checkout() {
  const { catalogue, scan, total, saved, receipt, pay } = useProducts();

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>🏷️ Checkout</h1>

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

      <Receipt receipt={receipt} />

      <button
        className={styles.payBtn}
        onClick={pay}
        disabled={receipt.length === 0}
      >
        Pay
      </button>
    </main>
  );
}
