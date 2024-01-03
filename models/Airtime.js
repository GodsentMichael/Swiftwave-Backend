const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AirtimeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    network: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    requestId: {
      type: String,
    },
    transactionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Airtime", AirtimeSchema);
