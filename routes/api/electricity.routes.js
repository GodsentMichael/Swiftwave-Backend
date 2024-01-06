const express = require("express");
const { Router } = express;

const { isAuthenticated } = require("../../middlewares/auth");
const { electricityPrepaidRecharge, verifyMeterNumber, electricityPostpaidRecharge } = require("../../controllers/electricity");

const router = Router();

// route POST api/verify-meter
// desc  for user to verify their meter number
// access public
router.post("/verify-meter" ,verifyMeterNumber);

// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
router.post("/buy-prepaid-electricity", isAuthenticated ,electricityPrepaidRecharge);
// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
router.post("/buy-postpaid-electricity", isAuthenticated ,electricityPostpaidRecharge);

module.exports = router;
