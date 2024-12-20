import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { currentUser, errorHandler, NotFoundError } from "@devdezyn/common";
import { createOrderRouter } from "./routes/create";
import { readOrderRouter } from "./routes/read";
import { listOrderRouter } from "./routes/list";

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

app.use(createOrderRouter);
app.use(readOrderRouter);
app.use(listOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
