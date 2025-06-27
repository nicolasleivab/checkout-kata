import { Router } from "express";
import productsRoute from "./v1/products.route";

const v1 = Router();
v1.use("/products", productsRoute);

export default v1;
