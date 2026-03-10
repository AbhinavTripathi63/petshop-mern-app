const express = require("express");
const Product = require("../models/Product");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public: list products
router.get("/", async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// Public: single product
router.get("/:id", async (req, res) => {
  const item = await Product.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Admin: create
router.post("/", adminAuth, async (req, res) => {
  const created = await Product.create(req.body);
  res.status(201).json(created);
});

// Admin: update
router.put("/:id", adminAuth, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

// Admin: delete
router.delete("/:id", adminAuth, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
