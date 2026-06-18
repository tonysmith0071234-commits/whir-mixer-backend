const mongoose = require("mongoose");
const Mix = require("../models/Mix");
const asyncHandler = require("../utils/asyncHandler");
const { generateReference } = require("../utils/reference");
const { ADDRESS_EXPIRY_MINUTES } = require("../config/constants");
const env = require("../config/env");

async function findMix(idOrRef, projection) {
  if (mongoose.isValidObjectId(idOrRef)) {
    const byId = await Mix.findById(idOrRef, projection);
    if (byId) return byId;
  }
  return Mix.findOne({ reference: idOrRef }, projection);
}

exports.createMix = asyncHandler(async (req, res) => {
  const { addresses, delay } = req.body;
  const expiresAt = new Date(Date.now() + ADDRESS_EXPIRY_MINUTES * 60 * 1000);

  const mix = await Mix.create({
    reference: generateReference(),
    destinationAddresses: addresses,
    delay,
    depositAddress: env.enableMockDeposit ? env.mockDepositAddress : null,
    status: "awaiting_deposit",
    expiresAt,
    statusHistory: [{ status: "awaiting_deposit" }],
  });

  res.status(201).json(mix.toPublic());
});

exports.getMix = asyncHandler(async (req, res) => {
  const mix = await findMix(req.params.id);
  if (!mix) return res.status(404).json({ error: "Mix not found" });
  res.json(mix.toPublic());
});

exports.getMixStatus = asyncHandler(async (req, res) => {
  const mix = await findMix(req.params.id, "reference status expiresAt");
  if (!mix) return res.status(404).json({ error: "Mix not found" });
  res.json({ reference: mix.reference, status: mix.status, expiresAt: mix.expiresAt });
});
