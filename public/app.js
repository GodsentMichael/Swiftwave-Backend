require("module-alias/register");
require("reflect-metadata");

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");

const db = require("../configs/dbConfig");
const { AppError } = require("../helpers/error");

// App Init
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Swift-wave API");
});

// Register Routes

require("../routes/index.routes")(app);

// Calling the db connection function.
db();

app.use((error, req, res, next) => {
  error.status = error.status || "error";
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).json({
    errors: [
      {
        error: error.message,
      },
    ],
  });
});

module.exports = app;
