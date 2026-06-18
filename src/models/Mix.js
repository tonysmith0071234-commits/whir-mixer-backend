const mongoose = require("mongoose");
const {
  MIX_STATUSES,
  SERVICE_FEE_PERCENT,
  NETWORK_FEE_BTC,
} = require("../config/constants");

const statusEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: MIX_STATUSES, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const mixSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    destinationAddresses: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 1 && v.length <= 3,
        message: "A mix needs between 1 and 3 destination addresses.",
      },
    },
    delay: { type: String, required: true },
    depositAddress: { type: String, default: null },
    status: {
      type: String,
      enum: MIX_STATUSES,
      default: "awaiting_deposit",
      index: true,
    },
    serviceFeePercent: { type: Number, default: SERVICE_FEE_PERCENT },
    networkFeeBtc: { type: Number, default: NETWORK_FEE_BTC },
    amountReceivedBtc: { type: Number, default: null },
    amountSentBtc: { type: Number, default: null },
    expiresAt: { type: Date, required: true },
    statusHistory: { type: [statusEventSchema], default: [] },
  },
  { timestamps: true }
);

mixSchema.methods.toPublic = function () {
  return {
    id: this._id,
    reference: this.reference,
    status: this.status,
    destinationAddresses: this.destinationAddresses,
    delay: this.delay,
    depositAddress: this.depositAddress,
    serviceFeePercent: this.serviceFeePercent,
    networkFeeBtc: this.networkFeeBtc,
    amountReceivedBtc: this.amountReceivedBtc,
    amountSentBtc: this.amountSentBtc,
    expiresAt: this.expiresAt,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("Mix", mixSchema);
