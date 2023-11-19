const multer = require('multer');
const fs = require("fs");
const path = require('path');
const Report = require('../models/ReportIssue');
const User = require("models/User")
const {ReportIssueSchema} = require("validations/reportIssue")
const { badRequest, notFound } = require("helpers/error");
const { cloudinaryConfig, uploader } = require("../services/cloudinaryConfig")
const {reportReceived} = require("helpers/mails/otp")
const sendEmail = require("services/email");

exports.reportIssue = async (req, res) => {
    const MAX_RETRY_ATTEMPTS = 3;
    const { id } = req.user;
    try {
      let user = await User.findById(id);
  
      if (!user) {
          return notFound(res, "User");
      }

        const username = user.userName;

      if (!req.file) {
        return res.status(400).json({
          error: 'No report image uploaded....',
        });
      }
  
      let result;
      let retryAttempts = 0;
  
      // THIS IS TO RETRY THE CLOUDINARY UPLOAD IN CASE OF NETWORK UPLOAD
      while (retryAttempts < MAX_RETRY_ATTEMPTS) {
        try {
          result = await uploader.upload(req.file.path, {
            folder: 'report',
          });
  
          // IF THE UPLOAD IS SUCCESSFUL, BREAK OUT OF THE RETRY LOOP
          break;
        } catch (uploadError) {
          console.error('Error uploading to Cloudinary=>', uploadError);
  
          retryAttempts++;
  
          if (retryAttempts < MAX_RETRY_ATTEMPTS) {
            console.log(`Retrying upload (attempt ${retryAttempts})...`);
          } else {
            
           // ONCE THE MAX ATTEMPT IS REACHED, THROW THE UPLOAD ERROR
            throw uploadError;
          }
        }
      }
  
      // DELETE FILE FRO, THE SERVER FOLDER AFTER THE SUCCESSUL UPLOAD TO CLOUDINARY
      fs.unlinkSync(req.file.path);
  
      const body = ReportIssueSchema.safeParse(req.body);
  
      if (!body.success) {
        return res.status(400).json({
          errors: body.error.issues,
        });
      }
  
      const { category, subject, email, description,  } = body.data;
  
    // Save the report to db
        const report = new Report({
            category,
            subject,
            email,
            description,
            image: {
            public_id: result.public_id,
            url: result.secure_url,
            },
        });

        // SEND MAIL TO SWIFT MANAGER EMAIL CONCERNING THE USER REPORT.
        const data = {
            to: email,
            text: "Swiftwave Report Desk",
            subject: "Your Swiftwave Report: We've Got It",
            html: reportReceived(username),
          };
          await sendEmail(data);
        
        //TODO
        // Find a way to notify swiftwave that a report was sent to them, so they can look into it.
        // For now we'd just check the sent emails part of the gmail sending these emails.
    
      res.status(200).json({
        msg: 'Report Submitted Successfully',
        report: {
            category,
            subject,
            email,
            description,
            image: {
            public_id: result.public_id,
            url: result.secure_url,
            },
        }
      });
    } catch (error) {
      console.log('REPORT COMPLAINT ERROR=>', error);
      res.status(500).json({
        errors: [
          {
            error: 'Server Error',
          },
        ],
      });
    }
  };
  