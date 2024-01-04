const mongoose = require("mongoose");

const accountDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountReference: { type: String, required: true },
    accountName: { type: String, required: true },
    currencyCode: {
      type: String,
      required: [true, "currency is required"],
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },

    virtualAccountNumber: { type: String, required: true },
    bankName: { type: String, required: true },
    bankCode: { type: String, required: true },
    collectionChannel: { type: String, required: true },
    reservationReference: { type: String, required: true },
    reservedAccountType: { type: String, required: true },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountDetail", accountDetailSchema);
