import { RequestHandler } from "express";
import * as model from "../models/product.model";
import { ApiError } from "../middlewares/errorHandler";

export const list: RequestHandler<model.TNoParams, model.TProductRow[]> = (
  _req,
  res,
  next
) => {
  try {
    res.json(model.findAll());
  } catch (error) {
    next(error);
  }
};

export const updatePriceAndOffer: RequestHandler<
  { sku: model.TSku },
  { message: string; updatedBy: string } | { error: string },
  model.TUpdatePriceOfferParams
> = (req, res, next) => {
  try {
    const { sku } = req.params;
    const { unit_price, offer_n, offer_price } = req.body;

    // Validate required fields
    if (typeof unit_price !== "number" || unit_price < 0) {
      throw new ApiError(400, "unit_price must be a non-negative number");
    }

    // Validate offer fields if provided
    if (offer_n !== null && (typeof offer_n !== "number" || offer_n <= 0)) {
      throw new ApiError(400, "offer_n must be a positive number or null");
    }

    if (
      offer_price !== null &&
      (typeof offer_price !== "number" || offer_price < 0)
    ) {
      throw new ApiError(
        400,
        "offer_price must be a non-negative number or null"
      );
    }

    // Validate offer consistency
    if (offer_n !== null && offer_price === null) {
      throw new ApiError(
        400,
        "offer_price must be provided when offer_n is set"
      );
    }

    if (offer_price !== null && offer_n === null) {
      throw new ApiError(
        400,
        "offer_n must be provided when offer_price is set"
      );
    }

    model.setPriceAndOffer(sku, { unit_price, offer_n, offer_price });

    res.json({
      message: `Successfully updated pricing for ${sku}`,
      updatedBy: req.user?.email || "unknown",
    });
  } catch (error) {
    next(error);
  }
};
