import styles from "./Receipt.module.css";
import { TReceiptLine } from "../../../services/useProducts";

type TSummaryProps = { receipt: TReceiptLine[] };

export default function Receipt({ receipt }: TSummaryProps) {
  return (
    <section
      className={styles.receipt}
      aria-labelledby="receipt-heading"
      role="region"
    >
      <h3 id="receipt-heading" className="sr-only">
        Receipt
      </h3>

      {receipt.length === 0 ? (
        <p className={styles.empty}>Scan items to begin…</p>
      ) : (
        <ol className={styles.list}>
          {receipt.map(({ desc, cents }, i) => (
            <li key={i} className={styles.line}>
              <span>{desc}</span>
              <span
                className={cents < 0 ? styles.negative : undefined}
                aria-label={cents < 0 ? "discount" : undefined}
              >
                €{(cents / 100).toFixed(2)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
