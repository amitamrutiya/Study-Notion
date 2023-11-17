import { Router } from "express";
const router = Router();

import {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} from "../controllers/Course"; // Course Controllers Import

import {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} from "../controllers/Category"; // Categories Controllers Import

import {
  createSection,
  updateSection,
  deleteSection,
} from "../controllers/Section"; // Sections Controllers Import

import {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} from "../controllers/SubSection"; // Sub-Sections Controllers Import

import {
  createRating,
  getAverageRating,
  getAllRatingAndReview,
} from "../controllers/RatingAndReview"; // Rating Controllers Import

import {
  addCourseIntoCart,
  removeCourseFromCart,
  clearCart,
} from "../controllers/Cart"; // Cart Controllers Import

import { auth, isInstructor, isStudent, isAdmin } from "../middlewares/auth"; // Importing Middlewares

import { updateCourseProgress } from "../controllers/courseProgress.controller";

// Course routes (only by Instructors)
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.post("/editCourse", auth, isInstructor, editCourse);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.delete("/deleteCourse", deleteCourse);

// Category routes (Only by Admin)
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// Cart routes (only by Student)
router.post("/addCourseIntoCart", auth, isStudent, addCourseIntoCart);
router.post("/removeCourseFromCart", auth, isStudent, removeCourseFromCart);
router.post("/clearCart", auth, isStudent, clearCart);

// Rating and Review (only by Student)
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingAndReview);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

export default router;
