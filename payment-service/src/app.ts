import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@devdezyn/common";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.set("trust proxy", true);

app.use(express.json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
