const { AppError } = require("../helpers/error");
const User = require("../models/User");

const findUserById = async (id) => {
  try {
    let user = await User.findById(id);

    if (!user) {
      throw AppError(404, "user does not exist");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = { findUserById };
