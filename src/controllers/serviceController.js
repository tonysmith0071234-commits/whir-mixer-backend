const Mix = require("../models/Mix");
const asyncHandler = require("../utils/asyncHandler");
const { MIX_STATUSES } = require("../config/constants");

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status, amountReceivedBtc, amountSentBtc } = req.body;
  if (!MIX_STATUSES.includes(status)) {
    return res.status(422).json({ error: "Invalid status" });
  }

  const mix = await Mix.findById(req.params.id);
  if (!mix) return res.status(404).json({ error: "Mix not found" });

  mix.status = status;
  if (amountReceivedBtc !== undefined) mix.amountReceivedBtc = amountReceivedBtc;
  if (amountSentBtc !== undefined) mix.amountSentBtc = amountSentBtc;
  mix.statusHistory.push({ status });
  await mix.save();

  res.json(mix.toPublic());
});

exports.setDepositAddress = asyncHandler(async (req, res) => {
  const { depositAddress } = req.body;
  if (!depositAddress) return res.status(422).json({ error: "depositAddress is required" });

  const mix = await Mix.findByIdAndUpdate(
    req.params.id,
    { depositAddress },
    { new: true }
  );
  if (!mix) return res.status(404).json({ error: "Mix not found" });

  res.json(mix.toPublic());
});
