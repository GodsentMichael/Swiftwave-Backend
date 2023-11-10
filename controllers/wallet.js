const Wallet = require("models/Wallet");
const User = require("models/User");
const { WalletSchema, FundWalletSchema } = require("validations/wallet");
const { encrypt } = require("helpers/auth");
// const WalletTransaction = require("models/WalletTransactionSchema")

// THIS WALLET CONTROLLER SHOULD BE TRIGGERED AS SOON AS THE USER IS CREATED
exports.createWallet = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    console.log("USER=>", user);
    const wallet = await Wallet.findOne({ user:id });

    if (!user) return res.status(400).json({ error: "User not found" });
    if (wallet) return res.status(400).json({ error: "Wallet already exists" });

    const createdWallet = await Wallet.create({
      user: user.id,
    });
    res.status(200).json({ message: "Wallet Created Succesully", createdWallet });
  } catch (error) {
    console.log("ERROR=>", error);
    res.status(500).json(error);
  }
};

//TO CREATE PIN FOR THE WALLET
exports.createPin = async (req, res) => {
  const { id } = req.user;
  const body = WalletSchema.safeParse(req.body);

  if (!body.success) return res.status(400).json({ errors: body.error.issues });

  try {
    const wallet = await Wallet.findOne({ user: id });
    if (!wallet) return res.status(400).json({ error: "Wallet not found" });

    if (wallet.isPinSet) {
      return res.status(400).json({ error: "Pin was already set" });
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
    console.log("ERROR=>", error);
    res.status(500).json(error);
  }
};

//CHANGE PIN
exports.changePin = async(req, res) => {

    const { id } = req.user;
    const body = WalletSchema.safeParse(req.body);
    if (!body.success) return res.status(400).json({ errors: body.error.issues });

    try {

        const wallet = await Wallet.findOne({ user: id });
        if (!wallet) return res.status(400).json({ error: "Wallet not found" });

        const { pin } = body.data;
        const hashedPin = await encrypt(pin);
        wallet.pin = hashedPin;
        await wallet.save();
        return res.status(200).json({ message: "Pin Changed Succesfully", wallet });

    } catch (error) {
        console.log("CHANGE WALLET PIN ERROR=>", error);
        res.status(500).json(error);
    }
}

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
        return res.status(200).json({ message: "Wallet Funded Succesfully", wallet });
    }
    catch (error) {
        console.log("ERROR=>", error);
        res.status(500).json(error);
    }
}

