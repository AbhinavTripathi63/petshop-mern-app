const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const userAuth = require("../middleware/userAuth");
const Order = require("../models/Order");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1) Create Razorpay order from our DB order
// POST /api/payments/create-order
router.post("/create-order", userAuth, async (req, res) => {
  try {
    const { orderId } = req.body; // our Mongo order _id
    if (!orderId) return res.status(400).json({ message: "orderId is required" });

    const order = await Order.findOne({ _id: orderId, userId: req.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // amount in paise
    const amount = Math.round(order.total * 100);

    const rpOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${order._id}`,
      notes: { mongoOrderId: String(order._id) }
    });

    order.payment.orderId = rpOrder.id;
    order.payment.status = "pending";
    await order.save();

    res.json({
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// 2) Verify payment signature and mark paid
// POST /api/payments/verify
router.post("/verify", userAuth, async (req, res) => {
  try {
    const { mongoOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!mongoOrderId) return res.status(400).json({ message: "mongoOrderId is required" });

    const order = await Order.findOne({ _id: mongoOrderId, userId: req.userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      order.payment.status = "failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    order.payment.paymentId = razorpay_payment_id;
    order.payment.signature = razorpay_signature;
    order.payment.status = "paid";
    order.isPaid = true;
    order.status = "paid";
    await order.save();

    res.json({ message: "Payment verified ✅", order });
  } catch (e) {
    res.status(500).json({ message: "Failed to verify payment" });
  }
});

module.exports = router;