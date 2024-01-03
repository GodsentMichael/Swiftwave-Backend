const express = require("express");
const { Router } = express;
const { isAuthenticated } = require("../../middlewares/auth");
const {
  airtimeRecharge,
  queryTransactionStatus,
  getAllAirtimeTransactions,
} = require("../../controllers/airtime");

const router = Router();

// route POST api/buy-airtime
// desc  for user to buy airtime
// access private
router.post("/buy-airtime", isAuthenticated, airtimeRecharge);

// route POST api/buy-airtime/query
// desc  to get the transaction status
// access private
router.post("/buy-airtime/query", isAuthenticated, queryTransactionStatus);

// route GET api/query
// desc  to get the transaction status
// access private
router.get("/get-airtimes", isAuthenticated, getAllAirtimeTransactions);

module.exports = router;
