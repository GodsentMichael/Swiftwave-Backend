const {
    createUser,
    userLogin,resendVerificationOTP,resendPasswordOTP,updatePassword,changePassword,getAllUsers, getUserDetail,updateUserInfo,deleteUserByEmail,deleteUser
  } = require("controllers/user");
  const express = require("express");
  const { isAuthenticated } = require("middlewares/auth");
  const {cloudinaryConfig} = require("../../services/cloudinaryConfig")
  const {upload} = require("../../middlewares/upload")
  const { Router } = express;
  
  const router = Router();
  
  // route POST api/user/create
  // desc  create user
  // access public
  router.post("/create", createUser);
  
  // route POST api/auth/login
  // desc  Login user
  // access public
  router.post("/login", userLogin);

  // route POST api/user/resend-verification-otp
  // desc  Resend Verification OTP
  // access public
  router.post("/resend-verification-otp", resendVerificationOTP);

  //route POST api/user/resend-password-otp
  // desc  Resend Password OTP
  // access public
  router.post("/resend-password-otp", resendPasswordOTP); 

  // route PUT api/user/password
  // desc  update user password
  // access public
  router.put("/password", updatePassword);

  // route PUT api/user/password/change
  // desc  change user password
  // access private
  router.put("/password/change",isAuthenticated ,changePassword);

  // route GET api/user/get-users
  // desc  all users password
  // access private
  router.get("/get-users",isAuthenticated, getAllUsers);

  // route GET api/user/get-user
  // desc get a user's details
  // access private
  router.get("/get-user", isAuthenticated, getUserDetail)
  
  // route POST api/user/update-profile
  // desc update  user's proile info
  // access private
  router.post("/update-profile",isAuthenticated,upload.single("image"), cloudinaryConfig, updateUserInfo)

  // route DELETE api/user/delete-user/:id
  // desc delete user by email; for testing
  // access private
  router.delete("/delete-user-by-email/", deleteUserByEmail);

  // route DELETE api/user/delete-user/:id
  // desc delete user
  // access private
  router.delete("/delete-user/", isAuthenticated, deleteUser);

  module.exports = router;
  