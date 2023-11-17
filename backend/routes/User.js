import { Router } from "express";
const router = Router();

import {
  login,
  signUp,
  sendOTP,
  changePassword,
} from "../controllers/Auth.controller.js";

import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/ResetPassword.controller.js";

import {
  deleteUserAccount,
  getAllUserDetails,
} from "../controllers/User.controller.js";

import { auth } from "../middlewares/auth.middelware.js";

// Authentication routes
router.post("/login", login);
router.post("/signup", signUp);
router.post("/sendotp", sendOTP);
router.post("/changepassword", auth, changePassword);

// Reset Password
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);

// User routes
router.delete("/deleteUserAccount", auth, deleteUserAccount);
router.get("/getUserDetails", auth, getAllUserDetails);

export default router;
