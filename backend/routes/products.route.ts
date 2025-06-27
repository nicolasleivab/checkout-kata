import { Router } from "express";
import * as ctrl from "../controllers/products.controller";

const router = Router();
router.get("/", ctrl.list);

export default router;
