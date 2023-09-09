const express = require("express")
const { Router } = express
const { isAuthenticated } = require("middlewares/auth");
const { airtimeRecharge } = require("controllers/airtime")

const router = Router()

// route POST api/buy-airtime
// desc  for user to buy airtime
// access private
router.post("/buy-airtime",isAuthenticated, airtimeRecharge )

module.exports = router