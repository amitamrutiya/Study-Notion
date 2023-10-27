const express = require("express");
const router = express.Router();

const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const {
  deleteUserAccount,
  getAllUserDetails,
} = require("../controllers/User");

const { auth } = require("../middlewares/auth");

// Authentication routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);

// Reset Password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// User routes
router.delete("/delete-account", auth, deleteUserAccount);
router.get("/getUserDetails", auth, getAllUserDetails);

module.exports = router;
