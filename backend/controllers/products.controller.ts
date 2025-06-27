import { RequestHandler } from "express";
import * as model from "../models/product.model";

export const list: RequestHandler<model.TNoParams, model.TProductRow[]> = (
  _req,
  res
) => {
  res.json(model.findAll());
};
