const express = require("express");
const { Router } = express;

const { isAuthenticated } = require("../../middlewares/auth");
const { electricityRecharge, verifyMeterNumber } = require("../../controllers/electricity");

const router = Router();

// route POST api/verify-meter
// desc  for user to verify their meter number
// access public
router.post("/verify-meter" ,verifyMeterNumber);

// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
router.post("/buy-electricity", isAuthenticated ,electricityRecharge);

module.exports = router;
