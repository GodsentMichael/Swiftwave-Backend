const User = require("models/User");
// const { uploader } = require("cloudinary");
const fs = require("fs");
const { getSecondsBetweenTime, timeDifference } = require("helpers/date");
const {
  UserSchema,
  VerifyUserSchema,
  LoginUserSchema,
  VerifyPasswordOtpSchema,
  UpdatePasswordSchema,ChangePasswordSchema,
  ResetPasswordSchema,UpdateUserProfile
} = require("validations/user");
const { encrypt } = require("helpers/auth");
const { compare } = require("helpers/auth");
const { generateToken, generateRefreshToken } = require("helpers/token");
const { validateUser } = require("services/auth");
const { generateOTP } = require("helpers/token");
const { badRequest, notFound } = require("helpers/error");
const verifyOTP = require("helpers/verifyOtp");
const sendEmail = require("services/email");
const { createAccountOtp, resetPasswordOtp } = require("helpers/mails/otp");
const { cloudinaryConfig, uploader } = require("../services/cloudinaryConfig")

// CREATE/REGISTER  USER
exports.createUser = async (req, res) => {
  const body = UserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      errors: body.error.issues,
    });
  }

  const { userName, email, phoneNumber, password, howDidYouHear } = body.data;
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
      user
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

// VERIFY NEWLY CREATED USER
exports.verifyUser = async (req, res) => {
  const body = VerifyUserSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({
      errors: body.error.issues,
    });
  }
  const { email, otp } = body.data;
  // console.log("EMAIL & OTP=>", otp, email);

  try {
    const { error, user } = await validateUser(email, otp);
    console.log("VERIFIED USER=>", user);

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

// USER LOGIN
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
    //TO CHECK IF USER'S VERIFICATION IS COMPLETE
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


// RESEND VERIFIICATION OTP
exports.resendVerificationOTP = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
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

// FORGOT PASSWORD
exports.forgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      email
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

// TO VERIFY OTP FOR FORGOT PASSWORD
exports.verifyForgotPasswordOtp = async (req, res) => {
  const body = VerifyPasswordOtpSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const { email, otp } = body.data;

  try {
    const user = await User.findOne({ email });
    // console.log("USER=>", user);

    if (!(await compare(otp, user.otp))) {
      return badRequest(res, "Invalid OTP");
    }
    if (getSecondsBetweenTime(user.otpExpireIn) > timeDifference["2m"]) {
      return badRequest(res, "This otp has expired");
    }

    res.status(200).json({ message: "OTP Verified!" });
  } catch (error) {
    console.log("VERIFY OTP ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// TO RESET PASSWORD
exports.resetPassword = async (req, res) => {
  const body = ResetPasswordSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }
  const { email, newPassword, repeatPassword } = body.data;

  if (newPassword !== repeatPassword) {
    return res.status(400).json({ errors: [{ error: "Passwords do not match" }] });
  }
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    console.log("USER ASKING TO RESET PASSSWORD=>", user);
    if (!user) {
      return notFound(res, "User not found");
    }

      // Check if the new password is the same as the previous password
      const isSamePassword = await compare(newPassword, user.password);

      if (isSamePassword) {
        return res.status(400).json({ errors: [{ error: "New Password cannot be the same as the previous one." }] });
      }

    // Encrypt the new password
    const newPasswordHash = await encrypt(newPassword);
    // Update the user's password with the new encrypted password
    user.password = newPasswordHash;
    await user.save();
    res.status(200).json({ message: "Password has been successfully reset" });
    
  } catch (error) { 
    console.log("RESET PASSWORD ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// RESEND PASSWORD OTP
exports.resendPasswordOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({email});
   
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

    // Send the new verification code to the user
    const data = {
      to: email,
      text: "Swiftwave resend Password OTP",
      subject: "Kindly Verify Your Password OTP",
      html: resetPasswordOtp(newOTP),
    };
    await sendEmail(data);

    res.status(200).json({ message: "New verification code sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE PASSWORD
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

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const body = ChangePasswordSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  const {  currentPassword, newPassword, repeatNewPassword } = body.data;

  try {
    //FIND THE USER BY id
    const user = await User.findById(req.user.id);
    console.log("USER=>", user);

    if (!user) {
      return notFound(res, "User");
    }

   // VERIFY IF CURRENT PASSWORD MATCHES NEW ONE
    const isPasswordMatch = await compare(currentPassword, user.password);

    if (!isPasswordMatch) {
      return badRequest(res, " Current password doesn't match");
    }

    // ENCRYPT THE NEW PASSWORD
    const newPasswordHash = await encrypt(newPassword);

    // THEN UPDATE THE USER'S PASSWORD WITH THE NEW ENCRYPTED PASSWORD
    user.password = newPasswordHash;
    await user.save();

    res
      .status(200)
      .json({ message: "Password changed successfully", data: true });
  } catch (error) {
    console.log("CHANGE PASSWORD ERROR=>", error);
    res.status(500).json({ errors: [{ error: "Server Error" }] });
  }
};

// TO GET ALL USERS
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

// UPDATE USER PROFILE



exports.updateUserInfo = async (req, res) => {
  const MAX_RETRY_ATTEMPTS = 3;
  const { id } = req.user;
  try {
    let user = await User.findById(id);

    if (!user) {
      return notFound(res, "User");
    }

    let result;
    let retryAttempts = 0;

    // THIS IS TO RETRY THE CLOUDINARY UPLOAD IN CASE OF NETWORK UPLOAD
    while (retryAttempts < MAX_RETRY_ATTEMPTS) {
      try {
        const fileBuffer = req.file.buffer;

    // CONVERT THE FILE BUFFER TO BASE64 STRING
    const fileString = fileBuffer.toString('base64');

    result = await uploader.upload(`data:image/png;base64,${fileString}`, {
      folder: 'avatars',
    });

        // IF THE UPLOAD IS SUCCESSFUL, BREAK OUT OF THE RETRY LOOP
        break;
      } catch (uploadError) {
        console.error('Error uploading to Cloudinary =>', uploadError);

        retryAttempts++;

        if (retryAttempts < MAX_RETRY_ATTEMPTS) {
          console.log(`Retrying upload (attempt ${retryAttempts})...`);
        } else {
          // ONCE THE MAX ATTEMPT IS REACHED, THROW THE UPLOAD ERROR
          throw uploadError;
        }
      }
    }

    const body = UpdateUserProfile.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({
        errors: body.error.issues,
      });
    }

    const { userName, phoneNumber } = body.data;

    // Update the user in the database
    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          userName: userName,
          phoneNumber: phoneNumber,
          'avatar.public_id': result.public_id,
          'avatar.url': result.secure_url,
        },
      },
      { new: true }
    );

    res.status(200).json({
      msg: 'User Profile Updated Successfully',
      user: {
        userName,
        phoneNumber,
        avatar: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      },
    });
  } catch (error) {
    console.log('UPDATE USER ERROR =>', error);
    res.status(500).json({
      errors: [
        {
          error: 'Server Error',
        },
      ],
    });
  }
};
//GET A USER'S DETAILS
exports.getUserDetail = async(req, res) => {
  try {
    const {id} = req.user

    const userDetails = await User.find({_id:id})
    if (!userDetails) {
      return res.status(404).json({
        errors: [
          {
            error: "User's details not found",
          },
        ],
      });
    }
    return res.status(200).json({msg:"User successfully fetched", userDetails})

  } catch (error) {
    console.log("ERROR GETING USER DETAILS=>",error )
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
}

// USER LOGOUT
exports.userLogout = async (req, res) => {

  // Get the token from the header
  

  const token = req.header('authorization');

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  // Add the token to the blacklist
  await BlacklistToken.create({ token });

  res.status(200).json({
    message: "Logout Success",
  });
};


// DELETE USER FOR TESTING (by email)
exports.deleteUserByEmail = async (req, res) => {
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

// DELETE USER (where a user can delete their account by id)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findByIdAndDelete(id);

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
    console.error("DELETE USER ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};
