const { isAuthenticated } = require("middlewares/auth");
const {
  verifyUser,
 
} = require("controllers/user");
const express = require("express");
const { Router } = express;

const router = Router();

// route POST api/auth/verify
// desc  verify user
// access public
router.post("/verify", verifyUser);

// TODO: add rate limit

module.exports = router;
