const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    howDidYouHear: {
      type: String,
      enum: ["Online Ads", "Word of Mouth", "Social Media", "Other"],  // Add more options as needed
    },
    otp: {
      type: String,
    },
    otpExpireIn: {
      type: Number,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", UserSchema);
