const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminAuth = require("../middleware/adminAuth");
const Product = require("../models/Product");
const Service = require("../models/Service");


const router = express.Router();

/**
 * POST /api/admin/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN email:", email);

    const admin = await Admin.findOne({ email: String(email).toLowerCase() });
    console.log("FOUND admin?", !!admin);

    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    console.log("PASSWORD MATCH?", ok);

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token });
  } catch (e) {
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 * POST /api/admin/seed-sample
 * Admin-only: inserts sample products & services.
 * If already seeded, it won’t duplicate (simple check).
 */
router.post("/seed-sample", adminAuth, async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const serviceCount = await Service.countDocuments();

    // Simple safety: if data already exists, avoid duplicates
    if (productCount > 0 || serviceCount > 0) {
      return res.json({
        message: "Sample data not added because products/services already exist.",
        productCount,
        serviceCount
      });
    }

    const sampleProducts = [
      {
        name: "Premium Dog Food (2kg)",
        price: 499,
        imageUrl:
          "https://images.unsplash.com/photo-1601758123927-1960f50b3f8a?auto=format&fit=crop&w=900&q=60",
        inStock: true,
        description: "High protein dog food for healthy growth."
      },
      {
        name: "Cat Toy Mouse",
        price: 149,
        imageUrl:
          "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=60",
        inStock: true,
        description: "Soft and fun toy to keep cats active."
      },
      {
        name: "Pet Shampoo",
        price: 199,
        imageUrl:
          "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=900&q=60",
        inStock: true,
        description: "Gentle shampoo for sensitive pet skin."
      },
      {
        name: "Chew Bone Treats",
        price: 299,
        imageUrl:
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=60",
        inStock: true,
        description: "Tasty chew bones to help dental health."
      },
      {
        name: "Pet Collar (Adjustable)",
        price: 179,
        imageUrl:
          "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=60",
        inStock: true,
        description: "Comfortable adjustable collar for daily walks."
      }
    ];

    const sampleServices = [
      {
        name: "Basic Grooming",
        description: "Bath, brushing, nail trim and ear cleaning.",
        price: 799,
        available: true
      },
      {
        name: "Vet Consultation",
        description: "General health check and basic consultation.",
        price: 599,
        available: true
      },
      {
        name: "Obedience Training (1 Session)",
        description: "Basic commands training session for your pet.",
        price: 999,
        available: true
      },
      {
        name: "Vaccination Support",
        description: "Guidance + appointment support for vaccinations.",
        price: 399,
        available: true
      },
      {
        name: "Pet Walking (30 mins)",
        description: "A calm, safe walk for your pet around your area.",
        price: 249,
        available: true
      }
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    const createdServices = await Service.insertMany(sampleServices);

    res.status(201).json({
      message: "✅ Sample data added successfully!",
      productsAdded: createdProducts.length,
      servicesAdded: createdServices.length
    });
  } catch (e) {
    res.status(500).json({ message: "Failed to seed sample data" });
  }
});


module.exports = router;

