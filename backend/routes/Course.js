const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course"); // Course Controllers Import

const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category"); // Categories Controllers Import

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section"); // Sections Controllers Import

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection"); // Sub-Sections Controllers Import

const {
  createRating,
  getAverageRating,
  getAllRatingAndReview,
} = require("../controllers/RatingAndReview"); // Rating Controllers Import

const {
  addCourseIntoCart,
  removeCourseFromCart,
  clearCart,
} = require("../controllers/Cart"); // Cart Controllers Import

const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth"); // Importing Middlewares

const { updateCourseProgress } = require("../controllers/courseProgress");

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

module.exports = router;
