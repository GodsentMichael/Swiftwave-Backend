const express = require("express");
const userRouter = require("routes/api/user.routes");
const authRouter = require("routes/api/auth.routes");
const airtimeRouter = require("routes/api/airtime.routes")


// define routes
module.exports = function routes(app) {
    app.use(express.json());
  
    // Registration & authentication routes.
      app.use("/api/user", userRouter);
      app.use("/api/auth", authRouter);

    // Airtime routes
      app.use("/api/", airtimeRouter)

}