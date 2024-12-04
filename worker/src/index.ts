import mongoose from "mongoose";
import chalk from "chalk";
import amqplib from "amqplib";
import { v4 as uuidV4 } from "uuid";
import Transaction from "./models/transaction";
import dotenv from "dotenv";

dotenv.config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.RabbitMQ_URI) {
    throw new Error("RabbitMQ_URI must be defined");
  }

  try {
    const client = await amqplib.connect(process.env.RabbitMQ_URI);

    client.on("close", () => {
      console.log("RabbitMQ connection closed!");
      process.exit();
    });

    client.on("connect", () => {
      console.log("Connected to RabbitMQ");
    });

    client.on("error", (err: any) => {
      console.log(err.message);
    });

    const channel: any = await client.createChannel();
    await channel.assertQueue("TRANSACTION");

    await channel.consume("TRANSACTION", async (data: any) => {
      if (data) {
        const payload = JSON.parse(data.content);
        console.log(payload);
        const { customerId, product, order } = payload;
        const newTransaction = Transaction.build({
          transactionRef: uuidV4(),
          customerId,
          productId: product.id,
          orderId: order.id,
          totalAmount: product.price,
        });
        await newTransaction.save();

        console.log(
          `Transaction with order id ${order.id} belonging to customer ${customerId} 
          as been saved to the DB with Transaction ref ${newTransaction.transactionRef}.`
        );

        channel.ack(data);
      }
    });

    process.on("SIGINT", () => client.close());
    process.on("SIGTERM", () => client.close());

    await mongoose.connect(`${process.env.MONGO_URI}/transaction-service`);
    console.log(chalk.green("Connected to MongoDb!!!"));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red("An unknown error occurred"));
    }
  }
};

start();
