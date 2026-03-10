require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "raghav555sharm@gmail.com";
  const password = "admin123"; // change later

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("✅ Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email, passwordHash });

  console.log("✅ Admin created");
  console.log("Email:", email);
  console.log("Password:", password);

  process.exit(0);
}

run().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});
