const {
    createWallet, createPin, changePin,resetPinOTP,verifyResetPinOTP, setNewPin, fundWallet, getUserWallet
  } = require("controllers/wallet");
const { isAuthenticated } = require("middlewares/auth");
const express = require("express");
const { Router } = express;

const router = Router();

// route POST api/wallet/create
// desc  create wallet
// access private
router.post("/create", isAuthenticated, createWallet);

// route POST api/wallet/create-pin
// desc  create pin
// access private
router.post("/create-pin", isAuthenticated, createPin)

// route POST api/wallet/create-pin
// desc  create pin
// access private
router.get("/get-wallet", isAuthenticated, getUserWallet)

// route POST api/wallet/create-pin
// desc  create pin
// access private
router.post("/change-pin", isAuthenticated, changePin)

// route POST api/wallet/reset-pin
// desc  reset pin
// access private
router.post("/reset-pin", isAuthenticated, resetPinOTP)

// route POST api/wallet/verify-otp
// desc  verify pin
// access private
router.post("/verify-otp", isAuthenticated, verifyResetPinOTP)

// route POST api/wallet/set-pin
// desc  set pin
// access private
router.post("/set-pin", isAuthenticated, setNewPin)

// route POST api/wallet/fund
// desc  fund wallet
// access private
router.post("/fund",isAuthenticated ,fundWallet)

module.exports = router;