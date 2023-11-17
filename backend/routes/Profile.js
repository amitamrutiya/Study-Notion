import { Router } from "express";
const router = Router();

import { auth, isInstructor } from "../middlewares/auth.middelware";
import {
  updateProfile,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} from "../controllers/Profile";

//  Profile routes
router.put("/updateProfile", auth, updateProfile);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

export default router;
