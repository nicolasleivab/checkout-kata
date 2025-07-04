import { Router } from "express";
import * as ctrl from "../../controllers/products.controller";
import { authenticate, requirePermission } from "../../middlewares/auth";

const router = Router();

router.get("/products", ctrl.list);
router.put(
  "/products/:sku",
  authenticate,
  requirePermission("manage_pricing"),
  ctrl.updatePriceAndOffer
);

export default router;
