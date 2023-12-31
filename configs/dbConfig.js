const mongoose = require("mongoose");
const { logger } = require("../utils/logger.util");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Db is succesfully connected!!🚀");
    logger.info("connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = db;
