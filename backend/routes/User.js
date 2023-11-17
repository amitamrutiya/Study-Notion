import { Router } from "express";
const router = Router();

import { login, signUp, sendOTP, changePassword } from "../controllers/Auth";

import {
  resetPasswordToken,
  resetPassword,
} from "../controllers/ResetPassword";

import { deleteUserAccount, getAllUserDetails } from "../controllers/User";

import { auth } from "../middlewares/auth";

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
