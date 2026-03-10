require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin"); // make sure you have Admin model at src/models/Admin.js

async function run() {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI missing in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@petshop.com";
    const plainPassword = "Admin@123";

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // If admin exists, update password. Otherwise create new admin.
    const existing = await Admin.findOne({ email });

    if (existing) {
      existing.passwordHash = passwordHash;
      await existing.save();
      console.log("✅ Admin password UPDATED");
    } else {
      await Admin.create({ email, passwordHash });
      console.log("✅ Admin CREATED");
    }

    console.log("=================================");
    console.log("LOGIN DETAILS:");
    console.log("Email:", email);
    console.log("Password:", plainPassword);
    console.log("=================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log("❌ Reset failed:", err.message);
    process.exit(1);
  }
}

run();