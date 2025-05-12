const { sendResponse, AppError } = require("./helpers/utils");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const mongoose = require("mongoose");
const mongo_URI = process.env.MONGO_URI;

mongoose
  .connect(mongo_URI)
  .then(() => console.log(`DB connected ${mongo_URI}`))
  .catch((err) => console.log(err));

const userRouter = require("./routes/user.api");
app.use("/users", userRouter);

const productRouter = require("./routes/product.api");
app.use("/products", productRouter);

const orderRouter = require("./routes/order.api");
app.use("/orders", orderRouter);

const meRouter = require("./routes/me.api");
app.use("/me", meRouter);

const authRouter = require("./routes/auth.api");
app.use("/auth", authRouter);

const categoryRouter = require("./routes/category.api");
app.use("/categories", categoryRouter);

app.use("/", indexRouter);

app.use((req, res, next) => {
  const err = new AppError(404, "Not Found", "Bad Request");
  next(err);
});

app.use((err, req, res, next) => {
  console.log("ERROR", err);
  return sendResponse(
    res,
    err.statusCode ? err.statusCode : 500,
    false,
    null,
    { message: err.message },
    err.isOperational ? err.errorType : "Internal Server Error"
  );
});

module.exports = app;
