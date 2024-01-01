const axios = require("axios");
const ElectricityBillPayment = require("../models/ElectricityBillPayment");
const { ElectricityBillPaymentSchema } = require("../validations/electricity");

// to recharge electricity bills
exports.electricityRecharge = async (req, res) => {
  const body = ElectricityBillPaymentSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  try {
    const electricityOrder = await ElectricityBillPayment.create({
      ...body.data,
    });

    //To make the call to vtpass endpoints and buy the airtime.
    const vtPassApiUrl = process.env.VTPASS_API_URL;
    console.log("vtPassApiUrl =>", vtPassApiUrl);

    const vtPassApiKey = process.env.VTPASS_API_KEY;
    const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
    const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;
    console.log("vtPassApiKey =>", vtPassApiKey);
    console.log("vtPassSecretKey =>", vtPassSecretKey);
    console.log("vtPassPublicKey =>", vtPassPublicKey);
    const vtPassApiResponse = await axios.post(
      vtPassApiUrl,
      {
        serviceID: body.data.billingServiceID,
        billersCode: body.data.meterNumber,
        variation_code: "prepaid",
        amount: body.data.amount,
        phone: body.data.phoneNumber,
        request_id: body.data.meterNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${vtPassApiKey}`,
          "api-key": vtPassApiKey,
          "secret-key": vtPassSecretKey,
          "public-key": vtPassPublicKey,
        },
      }
    );
    console.log("VT Pass API Response=>", vtPassApiResponse.data);
    const transactionId =
      vtPassApiResponse.data?.content?.transactions?.transactionId;
    console.log("transactionId=>", transactionId);

    // Update the order status and transaction details in your database
    if (
      vtPassApiResponse.data.response_description == "TRANSACTION SUCCESSFUL"
    ) {
      electricityOrder.status = "delivered";
      electricityOrder.transactionId = transactionId;
    } else if (vtPassApiResponse.data.code == "016") {
      electricityOrder.transactionId = transactionId;
      electricityOrder.status = "failed";
    }

    await electricityOrder.save();

    //TODO
    // Send a confirmation email to the user

    if (electricityOrder.status === "delivered") {
      return res
        .status(200)
        .json({ message: vtPassApiResponse.data.response_description });
    } else {
      return res
        .status(400)
        .json({ message: vtPassApiResponse.data.response_description });
    }
  } catch (error) {
    console.error("Recharge Electricity Bill Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
