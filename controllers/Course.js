const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

//createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tags: _tags,
      totalDuration,
      language,
      status,
      instructions: _instructions,
    } = req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    const tags = JSON.parse(_tags); //Convert the tag and instructions from stringified Array to Array
    const instructions = JSON.parse(_instructions);

    //validate data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !language ||
      !instructions.length ||
      !thumbnail ||
      !tags.length
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all the fields" });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }
    // Check for instructor
    let instructorDetails = await User.findById(req.user.id, {
      accountType: "Instructor",
    });
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create course",
      });
    }

    //check for category
    let categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid category",
      });
    }

    //upload thumbnail to cloudinary
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER
    );

    //create an entry for new course
    let newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      category: categoryDetails._id,
      tags,
      language,
      totalDuration,
      status,
      instructions,
    });

    //push course id to instructor's course array
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    //update category schema
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    //send response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error in creating course: " + error);
    return res.status(500).json({
      success: false,
      message: "Error on createCourse controller: " + error,
    });
  }
};

//getAllCourse handler function
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        category: true,
        studentsEnrolled: true,
      }
    )
      .populate("Instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    log("Error in showAllCourses controller: ");
    return req.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getCourseDetails handler function
exports.getCourseDetails = async (req, res) => {
  try {
    // get id
    const { courseId } = req.body;

    //validate data
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Please give course Id",
      });
    }

    // find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSections" },
      })
      .exec();

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course details with ${courseId}`,
      });
    }

    // send response
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log("Error in getCourseDetails controller: ");
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
