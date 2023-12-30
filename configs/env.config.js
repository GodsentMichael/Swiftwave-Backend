require("dotenv").config();

exports.financialProvider = {
  paystack: {
    baseURL: process.env.PAYSTACK_BASEURL || "https://api.paystack.co",
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    serviceCharge: Number(process.env.SERVICE_CHARGE),
  },
  monnify: {
    baseURL: process.env.MONIFY_SANDBOX_URL || "https://sandbox.monnify.com",
    apiKey: process.env.MONNIFY_API_KEY,
    secretKey: process.env.MONNIFY_SECRET_KEY,
    contractNumber: Number(process.env.MONNIFY_CONTRACT_NUMBER),
  },
};

exports.smsProvider = {
  termii: {
    sms: {
      baseURL: process.env.BASE_URL || "https://api.ng.termii.com/api",
      senderID: process.env.TERMII_SENDER_ID,
      apiKey: process.env.TERMII_API_KEY,
    },
  },
};
