const {
    createWallet, createPin, getUserWallet
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

// route GET api/wallet/get-wallet
// desc  get user's wallet
// access private
router.get("/get-wallet", isAuthenticated, getUserWallet)

module.exports = router;