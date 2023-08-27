const express = require("express");
const userRouter = require("routes/api/user.routes");
const authRouter = require("routes/api/auth.routes");


// define routes
module.exports = function routes(app) {
    app.use(express.json());
  
  
      app.use("/api/user", userRouter);
      app.use("/api/auth", authRouter);

}