import { Router } from "express";
import * as ctrl from "../../controllers/products.controller";

const router = Router();

router.get("/products", ctrl.list);
// router.post("/", ctrl.create);   // future mutations

export default router;
