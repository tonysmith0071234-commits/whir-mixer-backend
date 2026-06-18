const mongoose = require("mongoose");
const connectDb = require("../config/db");
const Admin = require("../models/Admin");
const env = require("../config/env");

(async () => {
  if (!env.adminEmail || !env.adminPassword) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
    process.exit(1);
  }

  await connectDb();
  const email = env.adminEmail.toLowerCase();
  const passwordHash = await Admin.hashPassword(env.adminPassword);

  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    await existing.save();
    console.log(`Admin password updated for ${email}`);
  } else {
    await Admin.create({ email, passwordHash });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.connection.close();
  process.exit(0);
})();
