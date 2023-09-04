require("module-alias/register");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const cors = require("cors");

const db = require("../configs/dbConfig");

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

module.exports = app;
