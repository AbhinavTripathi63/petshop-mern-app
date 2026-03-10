const express = require("express");
const Service = require("../models/Service");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Public: list
router.get("/", async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
});

// Public: single
router.get("/:id", async (req, res) => {
  const item = await Service.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Not found" });
  res.json(item);
});

// Admin: create
router.post("/", adminAuth, async (req, res) => {
  const created = await Service.create(req.body);
  res.status(201).json(created);
});

// Admin: update
router.put("/:id", adminAuth, async (req, res) => {
  const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  if (!updated) return res.status(404).json({ message: "Not found" });
  res.json(updated);
});

// Admin: delete
router.delete("/:id", adminAuth, async (req, res) => {
  const deleted = await Service.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
});

module.exports = router;
