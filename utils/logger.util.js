const pino = require("pino");
const expressPinoLogger = require("express-pino-logger");

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

module.exports = {
  expressPinoLogger,
  logger,
};
