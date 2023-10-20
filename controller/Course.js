const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

//createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      totalDuration,
      language,
    } = req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validate data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !duration ||
      !language ||
      !thumbnail
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all the fields" });
    }

    // Check for instructor
    const instructorDetails = await User.findById(req.user._id);
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not authorized to create course",
      });
    }

    //check for tag
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid tag",
      });
    }

    //upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER
    );

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      tag: tagDetails._id,
      language,
      totalDuration,
    });

    //push course id to instructor's course array
    instructorDetails.courses.push(newCourse._id);
    await instructorDetails.save();

    //update tag schema
    tagDetails.courses.push(newCourse._id);
    await tagDetails.save();

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
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        tag: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
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
