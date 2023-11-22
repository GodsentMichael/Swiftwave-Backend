const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true
    },
    fullName: {
      type: String,
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
      enum: ["Television", "Twitter", "Instagram", "Youtube", "LinkedIn",  "Friends"],  
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      }
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
