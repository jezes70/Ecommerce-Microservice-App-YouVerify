import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@devdezyn/common";
import Product from "../models/product";

const router = express.Router();

router.put(
  "/api/products/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero(0)"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      throw new NotFoundError();
    }

    existingProduct.set(req.body);

    await existingProduct.save();

    res.send(existingProduct);
  }
);

export default router;
