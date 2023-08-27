const { compare } = require("helpers/auth");
const { getSecondsBetweenTime, timeDifference } = require("helpers/date");
const User = require("models/User");

const validateUser = async (email, otp) => {
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return { error: "User not found" };
    }

    if (!(await compare(otp, user.otp))) {
      return { error: "Invalid OTP" };
    }

    if (getSecondsBetweenTime(user.otpExpireIn) > timeDifference["1hr"]) {
      return { error: "This code has expired" };
    }

    user = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          verified: true,
        },
      },
      { new: true }
    );

    return { user };
  } catch (error) {
    return { error };
  }
};

module.exports = { validateUser };
