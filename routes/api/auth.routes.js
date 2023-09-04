const { isAuthenticated } = require("middlewares/auth");
const {
  verifyUser,forgotPasswordOtp, verifyForgotPasswordOtp
 
} = require("controllers/user");
const express = require("express");
const { Router } = express;

const router = Router();

// route POST api/auth/verify
// desc  verify user
// access public
router.post("/verify", verifyUser);


// route POST api/auth/forgot-password
// desc  generate forgot-password OTP
// access public
router.post("/password/forgot-password", forgotPasswordOtp);

// route POST api/auth/verify
// desc  verify otp
// access public
router.post("/password/verify", verifyForgotPasswordOtp);

module.exports = router;
