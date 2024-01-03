const express = require("express");
const userRouter = require("routes/api/user.routes");
const authRouter = require("routes/api/auth.routes");
const airtimeRouter = require("routes/api/airtime.routes")
const electricityRouter = require("routes/api/electricity.routes")
const walletRouter = require(".././routes/api/wallet.routes")
const waitlistRouter = require(".././routes/api/waitlist.routes")
const kycRouter = require("../routes/api/upload-kyc.routes")


// define routes
module.exports = function routes(app) { 
    app.use(express.json());
  
    // Registration & authentication routes.
      app.use("/api/user", userRouter);
      app.use("/api/auth", authRouter);


    // Report routes
    app.use("/api/kyc", kycRouter);

}