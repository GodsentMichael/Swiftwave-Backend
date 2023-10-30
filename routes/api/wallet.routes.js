const {
    createWallet
  } = require("controllers/wallet");
const { isAuthenticated } = require("middlewares/auth");
const express = require("express");
const { Router } = express;

const router = Router();

// route POST api/wallet/create
// desc  create wallet
// access public
router.post("/create", isAuthenticated,createWallet);

module.exports = router;