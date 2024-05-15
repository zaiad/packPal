const express = require("express");
const app = express();
app.use(express.json());

const errorHandler = require("./middleware/errorHandler");

require("dotenv").config();

const authRoutes = require("./routes/authRouter");

const categoryRouter = require("./routes/categoryRouter");
const productRouter = require("./routes/productRouter");
const OrderRouter = require("./routes/orderRouter");
const userRouter = require("./routes/userRouter");
const loginRouter = require("./routes/loginRouter");
const statisticRouter = require("./routes/statisticRouter");

require("./Config/db");

const cors = require("cors");
app.use(cors());

// Routers

app.use("/api/auth", authRoutes);

app.use("/categories", categoryRouter);

app.use("/orders", OrderRouter);

app.use("/products", productRouter);

app.use("/login", loginRouter);

app.use("/user", userRouter);

app.use("/statistic", statisticRouter);

app.all("*", (req, res) => {
  res.send("Page not found");
});

// Error handler middleware
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);

module.exports = app;
