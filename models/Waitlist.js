const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define the Waitlist schema
const waitlistSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Waitlist model

module.exports = model('Waitlist', waitlistSchema);