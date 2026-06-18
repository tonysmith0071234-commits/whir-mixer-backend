const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Mix = require("../models/Mix");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");
const { MIX_STATUSES } = require("../config/constants");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email: String(email).toLowerCase() });
  if (!admin || !(await admin.verifyPassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: admin._id, email: admin.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  res.json({ token, admin: { email: admin.email } });
});

exports.listMixes = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || "20", 10), 1), 100);

  const filter = {};
  if (req.query.status && MIX_STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  const [items, total] = await Promise.all([
    Mix.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Mix.countDocuments(filter),
  ]);

  res.json({ page, limit, total, items: items.map((m) => m.toPublic()) });
});

exports.getMix = asyncHandler(async (req, res) => {
  const mix = await Mix.findById(req.params.id);
  if (!mix) return res.status(404).json({ error: "Mix not found" });
  res.json({ ...mix.toPublic(), statusHistory: mix.statusHistory });
});

exports.updateMix = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status && !MIX_STATUSES.includes(status)) {
    return res.status(422).json({ error: "Invalid status" });
  }

  const mix = await Mix.findById(req.params.id);
  if (!mix) return res.status(404).json({ error: "Mix not found" });

  if (status) {
    mix.status = status;
    mix.statusHistory.push({ status });
  }
  await mix.save();
  res.json(mix.toPublic());
});

exports.stats = asyncHandler(async (req, res) => {
  const grouped = await Mix.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
  const byStatus = Object.fromEntries(MIX_STATUSES.map((s) => [s, 0]));
  grouped.forEach((g) => {
    byStatus[g._id] = g.count;
  });
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  res.json({ total, byStatus });
});
