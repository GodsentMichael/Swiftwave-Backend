const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, default: 0 },
    // Even though user can be implied from wallet, let us
    // double save it for security
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isInflow: { type: Boolean },
    paymentMethod: { type: String, default: "Wallet" },
    currency: {
      type: String,
      required: [true, "currency is required"],
      default: "NGN",
      enum: ["NGN", "USD", "EUR", "GBP"],
    },
    transType: {
      type: String,
      required: true,
      enum: ["credit", "debit"],
    },
    status: {
      type: String,
      required: [true, "payment status is required"],
      enum: ["successful", "pending", "failed"],
    },
    description: {
      type: String,
    },
    previousBalance: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTransactionSchema);
