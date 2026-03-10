const express = require("express");
const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");
const Order = require("../models/Order");

const router = express.Router();

/**
 * POST /api/orders
 * User-only: Create an order from cart items.
 * body: { items: [{itemType,itemId,nameSnapshot,priceSnapshot,qty}], total, customerNote }
 */
router.post("/", userAuth, async (req, res) => {
  try {
    const { items, total, customerNote } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const created = await Order.create({
      userId: req.userId,
      items,
      total,
      customerNote: customerNote || ""
    });

    res.status(201).json(created);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create order" });
  }
});

/**
 * PATCH /api/orders/:id/whatsapp-opened
 * User-only: Mark that the user clicked WhatsApp button
 * (Only the owner can update their own order)
 */
router.patch("/:id/whatsapp-opened", userAuth, async (req, res) => {
  try {
    const updated = await Order.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: "whatsapp_opened" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

/**
 * GET /api/orders/my
 * User-only: Fetch logged-in user's orders
 */
router.get("/my", userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch my orders" });
  }
});

/**
 * GET /api/orders
 * Admin-only: list all orders
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/**
 * GET /api/orders/stats/summary
 * Admin-only: dashboard counts
 */
router.get("/stats/summary", adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, sum: { $sum: "$total" } } }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.sum || 0;
    res.json({ totalOrders, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

/**
 * PATCH /api/orders/:id/complete
 * Admin-only: mark order as completed
 */
router.patch("/:id/complete", adminAuth, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to complete order" });
  }
});

module.exports = router;