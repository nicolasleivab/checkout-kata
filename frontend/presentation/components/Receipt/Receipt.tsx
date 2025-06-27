import styles from "./Receipt.module.css";
import { TReceiptLine } from "../../../services/useProducts";
import { useState } from "react";

type TSummaryProps = { receipt: TReceiptLine[]; pay: () => void };

const ANIMATION_DURATION = 300;

export default function Receipt({ receipt, pay }: TSummaryProps) {
  const [erasing, setErasing] = useState<boolean>(false);

  const handlePay = () => {
    if (receipt.length === 0) return;

    setErasing(true);
    setTimeout(() => {
      pay();
      setErasing(false);
    }, ANIMATION_DURATION); //   matches CSS duration
  };

  return (
    <section aria-labelledby="receipt-heading" role="region">
      <div className={styles.receipt}>
        <h3 id="receipt-heading" className="sr-only">
          Receipt
        </h3>

        {receipt.length === 0 ? (
          <p className={styles.empty}>Scan items to begin…</p>
        ) : (
          <ol className={styles.list}>
            {receipt.map(({ desc, cents }, i) => (
              <li className={`${styles.line} ${erasing ? styles.erasing : ""}`}>
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
      </div>
      <button
        className={styles.payBtn}
        onClick={handlePay}
        disabled={receipt.length === 0}
      >
        Pay
      </button>
    </section>
  );
}
