const jwt = require("jsonwebtoken");
const { unAuthenticated } = require("../helpers/error");
const BlacklistToken = require("../models/Logout");

const isAuthenticated = async (req, res, next) => {
  // Check if token exists
  let token;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"].split(" ")[0] === "Bearer"
  ) {
    token = req.headers["authorization"].split(" ")[1];
  }

  try {
    if (!token) {
      return unAuthenticated(res);
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded.user;

    // Check if the token is blacklisted

    const isBlacklisted = await BlacklistToken.exists({token});
    console.log("BLACKLISTED TOKEN=>", isBlacklisted);
    
    if (isBlacklisted) {
      return res.status(401).json({
        error: "You logged-out; Please log in again.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({error: 'Authentication error'});
  }
};

module.exports = {
  isAuthenticated,
};
