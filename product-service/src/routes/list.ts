import express, { Request, Response } from "express";
import Product from "../models/product";

const router = express.Router();

router.get("/api/products", async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});

    res.send({
      status: true,
      data: products,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred");
    }
  }
});

export default router;
