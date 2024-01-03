const User = require("../models/User");
const Wallet = require("../models/Wallet");

exports.createUserWallet = async (id, res) => {
  const user = await User.findById(id);
  const wallet = await Wallet.findOne({ user: id });

  if (!user)
    return res.status(400).json({
      errors: [
        {
          error: "User not found",
        },
      ],
    });
  if (wallet)
    return res.status(400).json({
      errors: [
        {
          error: "Wallet already exists",
        },
      ],
    });

  const createdWallet = await Wallet.create({
    user: user.id,
  });

  return createdWallet;
};
