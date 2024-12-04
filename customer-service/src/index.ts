import mongoose from "mongoose";
import chalk from "chalk";
import app from "./app";
import { seedUsers } from "./models/seeder";
import dotenv from "dotenv";

dotenv.config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(`${process.env.MONGO_URI}/customer-service`);
    console.log(chalk.green("Connected to MongoDb!!!"));

    await seedUsers();
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    } else {
      console.error(chalk.red("An unknown error occurred"));
    }
  }

  app.listen(4000, () => {
    console.log(chalk.green("Customer Service is listening on port 4000!"));
  });
};

start();
