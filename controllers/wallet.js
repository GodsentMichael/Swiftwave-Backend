

const Wallet = require("../models/Wallet");
const User = require("../models/User");
const {
  WalletSchema,
  FundWalletSchema,
  ChangePinSchema,
  ResetPinSchema,
  VerifyOtpPinSchema,
  SetPinSchema,
} = require("../validations/wallet");
const { encrypt, compare } = require("../helpers/auth");
const { generateOTP } = require("../helpers/token");
const { badRequest, notFound } = require("../helpers/error");
const verifyOTP = require("../helpers/verifyOtp");
const sendEmail = require("../services/email");
const { createAccountOtp, resetPasswordOtp } = require("../helpers/mails/otp");
const { getSecondsBetweenTime, timeDifference } = require("../helpers/date");

// Based on the flow, we the wallet and the virtualAccount Number is created immediately the user signs up 
//so the next is to create a Pin for the Wallet

//TO CREATE PIN FOR THE WALLET
exports.createPin = async (req, res) => {
  const { id } = req.user;
  const body = WalletSchema.safeParse(req.body);

  if (!body.success) return res.status(400).json({ error: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    if (wallet.isPinSet) {
      // return res.status(400).json({ error: "Pin was already set" });
      return badRequest(res, "Pin was already set");
    } else {
      const { pin } = body.data;
    }

    if (!wallet.isPinSet) {
      const hashedPin = await encrypt(body.data.pin);
      wallet.pin = hashedPin;
      wallet.isPinSet = true;
      await wallet.save();
      return res
        .status(200)
        .json({ message: "Pin Created Succesfully", wallet });
    }
  } catch (error) {
    console.log("PIN CREATION ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

//CHANGE PIN
exports.changePin = async (req, res) => {
  const { id } = req.user;
  const body = ChangePinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    const { currentPin, newPin } = body.data;
    const hashedPin = await encrypt(newPin);
    wallet.pin = hashedPin;
    await wallet.save();
    return res.status(200).json({ message: "Pin Changed Succesfully", wallet });
  } catch (error) {
    console.log("CHANGE WALLET PIN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// RESET PIN
exports.resetPinOTP = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id);
  const body = ResetPinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const email = user.email;

    const otpValue = generateOTP();

    const otp = await encrypt(otpValue);

    const userWallet = new Wallet({
      ...body.data,
      email,
      otp,
      otpExpireIn: new Date().getTime() + 30 * 60 * 1000, // To expire in 30 minutes.
    });

    const data = {
      to: email,
      text: "Swift RESET PIN OTP Verification",
      subject: "Kindly Verify Your Account",
      html: createAccountOtp(otpValue),
    };
    await sendEmail(data);

    wallet.otp = otp;
    await wallet.save();
    return res.status(200).json({ message: "Reset OTP sent", wallet });
  } catch (error) {
    console.log("CHANGE WALLET OTP ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// VERIFY RESET PIN OTP
exports.verifyResetPinOTP = async (req, res) => {
  const { id } = req.user;
  const body = VerifyOtpPinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const { otp } = body.data;

    if (!(await compare(otp, wallet.otp))) {
      return badRequest(res, "Invalid OTP");
    }
    if (getSecondsBetweenTime(wallet.otpExpireIn) > timeDifference["2m"]) {
      return badRequest(res, "This otp has expired");
    }

    wallet.isPinSet = false;
    await wallet.save();
    return res.status(200).json({ message: "Reset OTP verified", wallet });
  } catch (error) {
    console.log("VERIFY WALLET PIN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// SET NEW PIN
exports.setNewPin = async (req, res) => {
  const { id } = req.user;
  const body = SetPinSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    const { newPin, confirmNewPin } = body.data;
    if (newPin !== confirmNewPin) {
      return badRequest(res, "New pin and confirm pin do not match");
    }
    const hashedPin = await encrypt(newPin);

    wallet.isPinSet = true;
    wallet.pin = hashedPin;
    await wallet.save();
    return res.status(200).json({ message: "Pin Changed Succesfully", wallet });
  } catch (error) {
    console.log("CHANGE WALLET PIN ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// TO FUND THE WALLET
exports.fundWallet = async (req, res) => {
  const { id } = req.user;
  const body = FundWalletSchema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });
    const { amount } = body.data;
    wallet.mainBalance = wallet.mainBalance + amount;
    await wallet.save();
    return res
      .status(200)
      .json({ message: "Wallet Funded Succesfully", wallet });
  } catch (error) {
    console.log(" WALLET FUNDING ERROR=>", error);
    res.status(500).json({
      errors: [
        {
          error: "Server Error",
        },
      ],
    });
  }
};

// GET USER WALLET
exports.getUserWallet = async (req, res) => {
  const { id } = req.user;
  try {
    const wallet = await Wallet.findOne({ user: id }).populate("account");
    if (!wallet) return res.status(400).json({ error: "No wallet Found" });

    return res.status(200).json({ wallet });
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


// fetchBanks(url)
// .then((data)=>{
//  console.log('supported Banks', data);
// })
// .catch((error)=>{
//   console.error();
// })