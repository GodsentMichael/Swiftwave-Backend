const Wallet = require("models/Wallet");
const User = require("models/User");
const { WalletSchema } = require("validations/wallet");
const { encrypt } = require("helpers/auth");
const { badRequest, notFound } = require("helpers/error");
// const WalletTransaction = require("models/WalletTransactionSchema")

// THIS WALLET CONTROLLER SHOULD BE TRIGGERED AS SOON AS THE USER IS CREATED
exports.createWallet = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    console.log("USER=>", user);
    const wallet = await Wallet.findOne({ user: user.id });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (wallet) return res.status(400).json({ error: "Wallet already exists" });

    const createdWallet = await Wallet.create({
      user: user.id,
    });
    res.status(200).json({ message: "Wallet Created Succesully", createdWallet });
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
      return res.status(200).json({ message: "Pin Created Succesfully", wallet });
    }
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

// GET USER WALLET
exports.getUserWallet = async (req, res) => {
  const { id } = req.user;
  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "No wallet Found" });

    return res.status(200).json({ wallet });
    }catch (error) {
      console.log(error);
      res.status(500).json({
        errors: [
          {
            error: "Server Error",
          },
        ],
      });
    }
}
