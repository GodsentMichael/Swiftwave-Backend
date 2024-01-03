const mongoose = require("mongoose");
const { Schema } = mongoose;

const ElectricityBillPaymentSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    trim: true,
  },
  meterNumber: {
    //billersCode
    type: String,
    required: true,
    trim: true,
  },
  billingServiceID: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model(
  "ElectricityBillPayment",
  ElectricityBillPaymentSchema
);
