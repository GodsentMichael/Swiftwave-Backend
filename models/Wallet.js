const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const WalletSchema = new Schema(
  {
    _id: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountDetail",
    },
    pin: {
      type: String, // Use string, so it can be hashed and saved to db.
    },
    isPinSet: {
      type: Boolean,
      default: false,
    },
    mainBalance: {
      type: Number,
      default: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
    },
    otp: {
      type: String,
    },
    virtualAccountNumber: {
      type: String,
    },
    account_id:{
      type:String,
    },
    otpExpireIn: {
      type: Number,
    },
    accountReference: { // Add institutionReference field
      type: String
    },
  },
  {
    timestamps: true,
  }
);
// Disable automatic generation of _id field by Mongoose
WalletSchema.set('id', false);
module.exports = model("Wallet", WalletSchema);
