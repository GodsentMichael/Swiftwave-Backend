const {
    createUser,
    userLogin,resendVerificationOTP,resendPasswordOTP,updatePassword,getAllUsers, getUserDetail,deleteUser
  } = require("controllers/user");
  const express = require("express");
  const { isAuthenticated } = require("middlewares/auth");
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

  // route GET api/user/get-users
  // desc  all users password
  // access private
  router.get("/get-users",isAuthenticated, getAllUsers);

  // route GET api/user/get-user
  // desc get a user's details
  // access private
  router.get("/get-user", isAuthenticated, getUserDetail)
  
  //route DELETE api/user/delete-user/:id
  //desc delete user
  //access private
  router.delete("/delete-user/", deleteUser);

  module.exports = router;
  