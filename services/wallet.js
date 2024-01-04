const { container } = require("tsyringe");

const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { MonnifyService } = require("../services/monify");
const Account = require("../models/Account");
const monnifyService = container.resolve(MonnifyService);

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

  const account = await monnifyService.createInvoiceReservedAccount(id);
  const {
    accountReference,
    accountName,
    currencyCode,
    customerEmail,
    customerName,
    accountNumber,
    bankName,
    bankCode,
    collectionChannel,
    reservationReference,
    reservedAccountType,
    status,
  } = account.responseBody;

  const createAccount = await Account.create({
    user: user._id,
    accountReference,
    accountName,
    currencyCode,
    customerEmail,
    customerName,
    virtualAccountNumber: accountNumber,
    bankName,
    bankCode,
    collectionChannel,
    reservationReference,
    reservedAccountType,
    status,
  });

  const createdWallet = await Wallet.create({
    user: user.id,
    account: createAccount._id,
    virtualAccountNumber: createAccount.virtualAccountNumber,
  });

  return createdWallet;
};
