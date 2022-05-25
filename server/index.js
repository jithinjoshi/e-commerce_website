require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/products")
const orderRouter = require("./routes/order");
const cartRouter = require("./routes/cart")
const stripeRouter = require("./routes/stripe")


const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


//mongoose connection
mongoose
  .connect("mongodb://localhost:27017/ecommerce-app")
  .then(() => console.log("Database connected successfully"));


app.use("/api/users",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/products",productRouter);
app.use("/api/orders",orderRouter);
app.use("/api/cart",cartRouter)
app.use("/api/checkout",stripeRouter)

app.listen(process.env.PORT || 7000, () =>
  console.log(`Server Started in PORT number ${process.env.PORT}`)
);
