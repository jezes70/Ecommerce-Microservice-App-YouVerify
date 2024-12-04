import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from "@devdezyn/common";
import Product from "../models/product";

const router = express.Router();

router.post(
  "/api/products",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than zero(0)"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, description, price, quantity, shipping } = req.body;

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      throw new BadRequestError("Title already exists");
    }

    const newProduct = Product.build({
      title,
      description,
      price,
      quantity,
      shipping,
    });
    await newProduct.save();

    res.status(201).send({
      status: true,
      data: newProduct,
      message: "Product created successfully",
    });
  }
);

export default router;
