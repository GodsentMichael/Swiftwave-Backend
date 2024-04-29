const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    uniqueCode: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    // placeOfBirth: {
    //   state: {
    //     type: String,
    //     required: true,
    //   },
    //   localGovtArea: {
    //     type: String,
    //     required: true,
    //   },
    // },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
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

// Generate unique code for each user
UserSchema.pre("save", function (next) {
  const initials = this.fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase();
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
  const uniqueCode = `SWIFT${randomNumber}`;
  this.uniqueCode = uniqueCode;
  console.log("UNIQUE CODE=>", uniqueCode);
  next();
});


module.exports = model("User", UserSchema);
