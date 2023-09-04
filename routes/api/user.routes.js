const {
    createUser,
    userLogin,resendVerificationOTP,
  } = require("controllers/user");
  const express = require("express");
  const { isAuthenticated } = require("middlewares/auth");
  const { Router } = express;
  
  const router = Router();
  
  // route POST api/user/create
  // desc  create user
  // access public
  router.post("/create", createUser);
  
  // route POST api/auth/login
  // desc  Login user
  // access public
  router.post("/login", userLogin);

  // route POST api/user/resend-verification-otp
  // desc  Resend Verification OTP
  // access public
  router.post("/resend-verification-otp", resendVerificationOTP);
  
  module.exports = router;
  