const jwt = require("jsonwebtoken");
const { unAuthorized } = require("../helpers/error");

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
      return unAuthorized(res, "You are not authenticated");
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = decoded.user;

    next();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  isAuthenticated,
};
