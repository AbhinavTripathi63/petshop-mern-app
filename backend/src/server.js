const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/product.routes");
const serviceRoutes = require("./routes/service.routes");
const orderRoutes = require("./routes/order.routes");
const userRoutes = require("./routes/user.routes");
const paymentRoutes = require("./routes/payment.routes");

const app = express();

// -------------------- Middlewares --------------------
app.use(helmet());
app.use(express.json({ limit: "10kb" }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true
  })
);

app.use(morgan("dev"));

// -------------------- Rate Limiter (Auth only) --------------------
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 30, // max requests in 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, try again later." }
});

// Apply limiter ONLY on auth routes (before routes)
app.use("/api/users", authLimiter);
app.use("/api/admin", authLimiter);

// -------------------- Routes --------------------
app.get("/", (req, res) => {
  res.send("PetShop API is running ✅");
});

app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

import path from "path";
import express from "express";


const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// -------------------- Start Server --------------------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
    process.exit(1);
  });