const express = require("express");
const router = express.Router();
const {
  joinWaitlist,
  emailList,
  deleteEmail,
} = require("../../controllers/waitlist");

// Endpoint to add an email to the waitlist
router.post("/join", joinWaitlist);

// Endpoint to get the list of emails in the waitlist
router.get("/list", emailList);

// Endpoint to delete user.
router.delete("/delete-email/:id", deleteEmail);

module.exports = router;
