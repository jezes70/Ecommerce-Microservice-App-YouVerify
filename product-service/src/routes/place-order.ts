import express, { Request, Response } from "express";
import { body } from "express-validator";
import { NotFoundError, requireAuth, validateRequest } from "@devdezyn/common";
import Product from "../models/product";
import axios from "axios";

const router = express.Router();

router.post(
  "/api/products/order",
  // requireAuth,
  [
    body("customerId").not().isEmpty().withMessage("User is required"),
    body("productId").not().isEmpty().withMessage("Product is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log(req.body);
    const { customerId, productId } = req.body;
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new NotFoundError();
    }

    const response = await axios.post(
      `${process.env.ORDER_URL as string}/api/orders`,
      {
        customerId,
        product: existingProduct,
      }
    );

    console.log(response.data);

    res.send({
      status: true,
      data: response.data,
      message: "Order created successfully",
    });
  }
);

router.post(
  "/api/products/order-with-queue",
  // requireAuth,
  [
    body("customerId").not().isEmpty().withMessage("User is required"),
    body("productId").not().isEmpty().withMessage("Product is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { customerId, productId } = req.body;

    res.send({
      status: true,
      message: "Order created successfully",
    });
  }
);

export default router;
