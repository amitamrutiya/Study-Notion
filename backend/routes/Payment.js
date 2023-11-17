import { Router } from "express";
const router = Router();

import {
  capturePayment,
  verifyPayment,
  sendPaymentSuccessEmail,
} from "../controllers/Payments";
import { auth, isStudent } from "../middlewares/auth";

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifyPayment);
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
);

export default router;
