const express = require("express");
const { Router } = express;
const { isAuthenticated } = require("../../middlewares/auth");
const {
 
  getDataVariationCodes,
  dataSubscription

} = require("../../controllers/data");

const router = Router();

// route POST api/buy-airtime
// desc  for user to buy airtime
// access private
// router.post("/buy-airtime", isAuthenticated, airtimeRecharge);

// route GET api/variation-codes
// desc  to get the variation codes for the data subscription.
// access private
router.get("/variation-codes", isAuthenticated, getDataVariationCodes);

// route GET api/buy-data
// desc  to buy data
// access private
router.post("/buy-data", isAuthenticated, dataSubscription);

module.exports = router;
