import { GiPeach, GiKiwiFruit, GiBananaPeeled } from "react-icons/gi";
import { FaAppleAlt } from "react-icons/fa";
import { IconType } from "react-icons";
import { TSku } from "../../types/products";

export const iconBySku: Record<TSku, IconType> = {
  APPLE: FaAppleAlt,
  BANANA: GiBananaPeeled,
  PEACH: GiPeach,
  KIWI: GiKiwiFruit,
};
