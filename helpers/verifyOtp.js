const User = require("../models/User");
// const bcrypt = require("bcrypt");
const { compare } = require("./auth");

const verifyOTP = async (email, otp) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return false; // user not found
    }
    const isValidOtp = await compare(otp, user.otp);
    if (!isValidOtp) {
     return false; // incorrect OTP
    }
    const currentTime = new Date().getTime();
    if (currentTime > user.otpExpireIn) {
      console.log("otp expired");
      return false; // OTP has expired
    }
    return true; // OTP is valid
  } catch (error) {
    console.log("VERIFY OTP ERROR", error);
    return false;
  }
};
module.exports = verifyOTP;
