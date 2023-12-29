const express = require("express");
const { Router } = express;

const { isAuthenticated } = require("../../middlewares/auth");
const { electricityRecharge } = require("../../controllers/electricity");

const router = Router();

// route POST api/buy-electricity
// desc  for user to buy electricity
// access private
router.post("/buy-electricity", electricityRecharge);

module.exports = router;
