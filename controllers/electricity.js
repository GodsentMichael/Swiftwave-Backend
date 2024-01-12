const axios = require("axios");
const User = require("../models/User");
const ElectricityBillPayment = require("../models/ElectricityBillPayment");
const { ElectricityBillPaymentSchema, ElectricityVerificationSchema } = require("../validations/electricity");
const { generateRequestId } = require("helpers/airtimeRecharge")


// TO VERIFY THE CUSTOMER'S METER NUMBER
exports.verifyMeterNumber = async (req, res) => {
  try {
    const body = ElectricityVerificationSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).json({ errors: body.error.issues });
    }

    const vtPassApiUrl = process.env.VTPASS_ELECTRICITY_API_URL;
    
    const vtPassApiKey = process.env.VTPASS_API_KEY;
    const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
    const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;
    
    const vtPassApiResponse = await axios.post(
      vtPassApiUrl,
      {
        serviceID: body.data.billingServiceID,
        billersCode: body.data.meterNumber,
        type: body.data.type,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": vtPassApiKey,
          "secret-key": vtPassSecretKey,
          "public-key": vtPassPublicKey,
        },
      }
    );

    // console.log("VT Pass API Response=>", vtPassApiResponse.data)

    if (vtPassApiResponse.data.code === '000') {
      const { Customer_Name, Meter_Number, Customer_District, Address, error } = vtPassApiResponse.data.content;
    
      if (error) {
        return res.status(400).json({
          errors: [{
              error: 'Meter verification failed', error,
          }, ],
      });
      } else {
        return res.status(200).json({
          message: 'Meter verification successful',
          customerName: Customer_Name,
          meterNumber: Meter_Number,
          customerDistrict: Customer_District,
          address: Address,
        });
      }
    } else {
      return res.status(500).json({ message: 'Unexpected response from VTpass API' });
    }
  } catch (error) {
    console.error('Meter Verification Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

//TO RECHARGE ELECTRICITY BILLS - Prepaid
exports.electricityPrepaidRecharge = async (req, res) => {
  const {id} = req.user
  const user = await User.find({user:id})
  if(!user){
      return res.status(404).json({
          errors: [{
              error: "User not found",
          }, ],
      });
  }

  const body = ElectricityBillPaymentSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  try {
    const electricityOrder = await ElectricityBillPayment.create({
      user: id,
      ...body.data,
      requestId: generateRequestId(),
    });

    const requestId = generateRequestId();

    //To make the call to vtpass endpoints and buy the electricity.
    const vtPassApiUrl = process.env.VTPASS_API_URL;
    // console.log("vtPassApiUrl =>", vtPassApiUrl);

    const vtPassApiKey = process.env.VTPASS_API_KEY;
    const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
    const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;

    const vtPassApiResponse = await axios.post(
      vtPassApiUrl,
      {
        serviceID: body.data.billingServiceID,
        billersCode: body.data.meterNumber,
        variation_code: "prepaid",
        amount: body.data.amount,
        phone: body.data.phoneNumber,
        request_id: requestId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": vtPassApiKey,
          "secret-key": vtPassSecretKey,
          "public-key": vtPassPublicKey,
        },
      }
    );

    console.log("VTPASS_API_RESPONSE=>", vtPassApiResponse)
   
    const transactionId =
      vtPassApiResponse.data?.content?.transactions?.transactionId;
  
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
        .json({ message: vtPassApiResponse.data});
    } else {
      return res
        .status(400)
        .json({ message: vtPassApiResponse.data.response_description });
    }
  } catch (error) {
    console.error("Recharge Electricity Bill Error=>", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//TO RECHARGE ELECTRICITY BILLS - Postpaid
exports.electricityPostpaidRecharge = async (req, res) => {
  const {id} = req.user
  const user = await User.find({user:id})
  if(!user){
      return res.status(404).json({
          errors: [{
              error: "User not found",
          }, ],
      });
  }

  const body = ElectricityBillPaymentSchema.safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.issues });
  }

  try {
    const electricityOrder = await ElectricityBillPayment.create({
      user: id,
      ...body.data,
      requestId: generateRequestId(),
    });

    const requestId = generateRequestId();

    //To make the call to vtpass endpoints and buy the electricity.
    const vtPassApiUrl = process.env.VTPASS_API_URL;

    const vtPassApiKey = process.env.VTPASS_API_KEY;
    const vtPassSecretKey = process.env.VTPASS_SECRET_KEY;
    const vtPassPublicKey = process.env.VTPASS_PUBLIC_KEY;

    const vtPassApiResponse = await axios.post(
      vtPassApiUrl,
      {
        serviceID: body.data.billingServiceID,
        billersCode: body.data.meterNumber,
        variation_code: "postpaid",
        amount: body.data.amount,
        phone: body.data.phoneNumber,
        request_id: requestId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": vtPassApiKey,
          "secret-key": vtPassSecretKey,
          "public-key": vtPassPublicKey,
        },
      }
    );
   
    const transactionId =
      vtPassApiResponse.data?.content?.transactions?.transactionId;
  
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
        .json({ message: vtPassApiResponse.data});
    } else {
      return res
        .status(400)
        .json({ message: vtPassApiResponse.data.response_description });
    }
  } catch (error) {
    console.error("Recharge Electricity Bill Error=>", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
