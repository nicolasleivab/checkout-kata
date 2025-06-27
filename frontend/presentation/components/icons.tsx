import { GiPeach, GiKiwiFruit, GiBananaPeeled } from "react-icons/gi";
import { FaAppleAlt } from "react-icons/fa";
import { IconType } from "react-icons";
import { TSku } from "../../../backend/models/product.model";

export const iconBySku: Record<TSku, IconType> = {
  APPLE: FaAppleAlt,
  BANANA: GiBananaPeeled,
  PEACH: GiPeach,
  KIWI: GiKiwiFruit,
};
