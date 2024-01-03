const express = require("express")
const { Router } = express
const { isAuthenticated } = require("middlewares/auth");
const { uploadKyc } = require('controllers/uploadKyc');
const {cloudinaryConfig} = require("../../services/cloudinaryConfig")
const {upload} = require("../../middlewares/upload")
const router = Router()

// route POST api/report-issue
// desc  for user to report issue
// access private
router.post('/kyc-upload',isAuthenticated, upload.single('image'),cloudinaryConfig, uploadKyc);

module.exports = router;
