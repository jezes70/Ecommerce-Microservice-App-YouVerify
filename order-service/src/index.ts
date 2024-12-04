import mongoose from "mongoose";
import chalk from "chalk";
import app from "./app";
import dotenv from "dotenv";
import { rabbitMQWrapper } from "./rabbitmq-wrapper";

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
    await rabbitMQWrapper.connect(process.env.RabbitMQ_URI, "ORDER");

    rabbitMQWrapper.client.on("close", () => {
      console.log("RabbitMQ connection closed!");
      process.exit();
    });

    process.on("SIGINT", () => rabbitMQWrapper.client.close());
    process.on("SIGTERM", () => rabbitMQWrapper.client.close());

    await mongoose.connect(`${process.env.MONGO_URI}/order-service`);
    console.log(chalk.green("Connected to MongoDb!!!"));
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red("An unknown error occurred"));
    }
  }

  app.listen(5000, () => {
    console.log("Order Service is listening on port 5000!");
  });
};

start();
