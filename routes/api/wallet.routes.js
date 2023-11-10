const {
    createWallet, createPin, changePin,fundWallet
  } = require("controllers/wallet");
const { isAuthenticated } = require("middlewares/auth");
const express = require("express");
const { Router } = express;

const router = Router();

// route POST api/wallet/create
// desc  create wallet
// access private
router.post("/create", isAuthenticated,createWallet);

// route POST api/wallet/create-pin
// desc  create pin
// access private
router.post("/create-pin", isAuthenticated, createPin)

// route POST api/wallet/create-pin
// desc  create pin
// access private
router.post("/change-pin", isAuthenticated, changePin)

// route POST api/wallet/fund
// desc  fund wallet
// access private
router.post("/fund",isAuthenticated ,fundWallet)

module.exports = router;