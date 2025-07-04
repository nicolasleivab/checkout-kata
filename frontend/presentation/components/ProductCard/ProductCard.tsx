import { TSku } from "../../../types/products";
import styles from "./ProductCard.module.css";
import { iconBySku } from "../icons";
import { IconType } from "react-icons";

type TProductProps = {
  sku: TSku;
  name: string;
  priceCents: number;
  onClick: () => void;
};

export default function ProductCard({
  sku,
  name,
  priceCents,
  onClick,
}: TProductProps) {
  const Icon: IconType = iconBySku[sku];

  return (
    <button
      className={styles.card}
      onClick={onClick}
      aria-label={`Add one ${name}`}
    >
      {Icon && <Icon size={28} aria-hidden />}
      <span>{name}</span>
      <span className={styles.price}>€{(priceCents / 100).toFixed(2)}</span>
    </button>
  );
}
