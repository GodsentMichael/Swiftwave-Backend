const User = require("models/User");
const { getSecondsBetweenTime, timeDifference } = require("helpers/date");
const {
  UserSchema,
  VerifyUserSchema,
  LoginUserSchema,
  VerifyPasswordOtpSchema,
  UpdatePasswordSchema,
} = require("validations/user");
const { encrypt } = require("helpers/auth");
const { compare } = require("helpers/auth");
const { generateToken, generateRefreshToken } = require("helpers/token");
const { validateUser } = require("services/auth");
const { generateOTP } = require("helpers/token");
const { badRequest, notFound } = require("helpers/error");
const verifyOTP = require("helpers/verifyOtp");
const sendEmail = require("services/email");
const { createAccountOtp } = require("helpers/mails/otp");

exports.createUser = async (req, res) => {
  const body = UserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      errors: body.error.issues,
    });
  }

  const { email, phoneNumber, password, howDidYouHear } = body.data;
  try {
    const checkPhone = await User.findOne({ phoneNumber });
    if (checkPhone) {
      return badRequest(res, "Phone Number already taken");
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return badRequest(res, "Email is already taken");
    }

    body.data.password = await encrypt(password);

    const otpValue = generateOTP();

    const otp = await encrypt(otpValue);

    const user = new User({
      ...body.data,
      otp,
      otpExpireIn: new Date().getTime() + 30 * 60 * 1000, // To expire in 30 minutes.
    });

    await user.save();

    const data = {
      to: email,
      text: "Swiftwave OTP Verification",
      subject: "Kindly Verify Your Account",
      html: createAccountOtp(otpValue),
    };
    await sendEmail(data);

    const refreshToken = generateRefreshToken(user._id);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: process.env.NODE_ENV === "development" ? false : true,
      maxAge: 240 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "account created",
      // token,
      refreshToken,
    });
  } catch (error) {
    console.log("CREATE USER ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

exports.verifyUser = async (req, res) => {
  const body = VerifyUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      errors: body.error.issues,
    });
  }
  const { email, otp } = body.data;
  console.log("EMAIL & OTP=>", otp, email);

  try {
    const { error, user } = await validateUser(email, otp);
    console.log("ERROR=>", error);
    console.log("USER=>", user);

    if (error) {
      return badRequest(res, error);
    }

    res.status(200).json({
      verified: user.verified,
      msg: "User verified",
    });
  } catch (error) {
    console.log("VERIFY USER ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  const body = LoginUserSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({
      error: body.error.issues,
    });
  }

  const { email, password } = body.data;
  try {
    const checkUser = await User.findOne({
      email: email,
    });

    if (!checkUser) {
      return badRequest(res, "Incorrect credentials");
    }
    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return badRequest(res, "Incorrect credentials");
    }
    //To check if user's verification is complete
    const verifiedUser = checkUser.verified;
    console.log("VERIFIED USER=>", verifiedUser);
    if (verifiedUser === false) {
      return res.status(400).json({
        error: "User not verified, please verify your account",
      });
    }
    const token = generateToken(checkUser._id, checkUser.email);
  
    res.status(200).json({
      message: "Login Success",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

//Resend Verification OTP
exports.resendVerificationOTP = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    console.log("InitialUser=>", user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp) {
      // Clear the already existing otp and create another one.
      user.otp = undefined;
      user.otpExpireIn = undefined;
      await user.save();
    }
    // Generate a new OTP
    const newOTP = generateOTP();
    const otp = await encrypt(newOTP);

    // Update user's OTP and OTP expiration
    user.otp = otp;
    user.otpExpireIn = new Date().getTime() + 30 * 60 * 1000;
    await user.save();

    console.log("NEWUSER=>", user);

    // Send the new verification code to the user
    const data = {
      to: email,
      text: "Swiftwave resend OTP Verification",
      subject: "Kindly Verify Your Account",
      html: createAccountOtp(newOTP),
    };
    await sendEmail(data);

    res.status(200).json({ message: "New verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Forgot password
exports.forgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    } else {
      const otpValue = generateOTP();
      const otp = await encrypt(otpValue);
      user.otp = otp;
      // To expire in 5mins.
      user.otpExpireIn = new Date().getTime();
      await user.save();
      // Send the new verification code to the user
      const data = {
        to: email,
        text: "Swiftwave Forgot Password OTP",
        subject: "OTP To Reset Your Password",
        html: createAccountOtp(otpValue),
      };
      await sendEmail(data);

      res.status(200).json({
        msg: `otp sent to ${email}`,
      });
    }
  } catch (error) {
    console.log("RESET PASSWORD ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// To verify the otp
exports.verifyForgotPasswordOtp = async (req, res) => {
  const body = VerifyPasswordOtpSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const { email, otp } = body.data;

  try {
    const user = await User.findOne({ email });
    console.log("USER=>", user);

    if (!(await compare(otp, user.otp))) {
      return badRequest(res, "Invalid OTP");
    }
    if (getSecondsBetweenTime(user.otpExpireIn) > timeDifference["2m"]) {
      return badRequest(res, "This otp has expired");
    }

    // const token = resetPasswordToken(user._id);

    res.status(200).json({ message: "OTP Verified!" });
  } catch (error) {
    console.log("VERIFY OTP ERROR", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

exports.updatePassword = async (req, res) => {
  const body = UpdatePasswordSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  const { email, oldPassword, newPassword } = body.data;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("USER=>", user);

    if (!user) {
      return notFound(res, "User not found");
    }

    // Verify if the old password matches the current password
    const isPasswordMatch = await compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return badRequest(res, "Old password doesn't match");
    }

    // Encrypt the new password
    const newPasswordHash = await encrypt(newPassword);

    // Update the user's password with the new encrypted password
    user.password = newPasswordHash;
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully", data: true });
  } catch (error) {
    console.log("UPDATE PASSWORD ERROR", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.log("GET ALL USERS ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// exports.deleteUser = async (req, res) => {
//   const {id} = req.user
//   try {
//     const findUser = await User.findById(id)
//     const user = await User.findByIdAndDelete(id);
//     console.log("USER=>", user)
//     if(!user){
//       return res.status(404).json({
//         errors: [
//           {
//             error: "User not found",
//           },
//         ],
//       });
//     }
//     res.status(200).json({
//       msg: "User Deleted",
//     });
//   } catch (error) {
//     console.log("DELETE USER ERROR", error);
//     res.status(500).json({
//       errors: [
//         {
//           error: "Server Error",
//         },
//       ],
//     });
//   }
// };

exports.deleteUser = async (req, res) => {
  const { email } = req.body; 

  try {
    const user = await User.findOneAndDelete({email});
    console.log("USER=>", user);

    if (!user) {
      return res.status(404).json({
        errors: [
          {
            error: "User not found",
          },
        ],
      });
    }   

    res.status(200).json({
      msg: "User Deleted",
    });
  } catch (error) {
    console.log("DELETE USER ERROR", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
