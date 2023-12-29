const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reportSchema = new Schema({
  complaintCategory: {
    type: String,
    enum: [
      "Bills Payment",
      "Account Top-up",
      "Trnsaction Pin",
      "Account Verification",
      "Others",
    ],
    required: true,
  },
  subject: { type: String, required: true },
  email: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  timestamp: { type: Date, default: Date.now },
});

const Report = model("Report", reportSchema);

module.exports = Report;
