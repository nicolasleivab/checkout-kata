import { RequestHandler } from "express";
import { SKUS, TSku } from "../models/product.model";

// Can be used to validate SKU parameters in future routes with parameters
export const validateSku: RequestHandler = (req, res, next) => {
  const { sku } = req.params;

  if (typeof sku !== "string" || !SKUS.includes(sku as TSku)) {
    return res.status(400).json({ error: "Invalid SKU" });
  }

  next();
};
