const express = require("express")
const { Router } = express
const { isAuthenticated } = require("middlewares/auth");
const { reportIssue } = require('controllers/reportIssue');
const {cloudinaryConfig} = require("../../services/cloudinaryConfig")
const {upload} = require("../../middlewares/upload")
const router = Router()

// route POST api/report-issue
// desc  for user to report issue
// access private
router.post('/report-issue',isAuthenticated, upload.single('image'),cloudinaryConfig, reportIssue);

module.exports = router;
