const express = require("express");
const userRouter = require("../routes/api/user.routes");
const authRouter = require("../routes/api/auth.routes");
const airtimeRouter = require("../routes/api/airtime.routes");
const electricityRouter = require("../routes/api/electricity.routes");
const walletRouter = require("../routes/api/wallet.routes");
const waitlistRouter = require(".././routes/api/waitlist.routes");
const reportRouter = require("../routes/api/report-issue.routes");
const monifyRouter = require("../routes/api/monify.routes");

// define routes
module.exports = function routes(app) {
  app.use(express.json());

  // Registration & authentication routes.
  app.use("/api/user", userRouter);
  app.use("/api/auth", authRouter);

  // Airtime routes
  app.use("/api/", airtimeRouter);

  // Electricity_Bills routes
  app.use("/api/", electricityRouter);

  // Wallet routes
  app.use("/api/wallet", walletRouter);

  // Waitlist routes
  app.use("/api/waitlist", waitlistRouter);

  // Report routes
  app.use("/api/report", reportRouter);

  // monify routes
  app.use("/api/monnify", monifyRouter);
};
