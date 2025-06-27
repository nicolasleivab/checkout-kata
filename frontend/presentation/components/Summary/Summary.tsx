import styles from "./Summary.module.css";

type TSummaryProps = {
  total: number;
  saved: number;
};

export default function Summary({ total, saved }: TSummaryProps) {
  return (
    <section className={styles.summary}>
      <span>
        Total: <strong>€{(total / 100).toFixed(2)}</strong>
      </span>
      <span>
        You saved: <strong>€{(saved / 100).toFixed(2)}</strong>
      </span>
    </section>
  );
}
