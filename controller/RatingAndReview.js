const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const User = require("../models/User");

// create Rating and review
exports.createRating = async (req, res) => {
  try {
    // get data
    const { rating, review, courseId } = req.body;
    const { userId } = req.user.id;

    // validate data
    if (!rating || !review || !courseId || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all the fields" });
    }

    // check if user is enrolled or not
    const user = await User.findById(userId);
    if (!user.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // TODO : not forget to run this method
    // const courseDetails = await Course.findOne({
    //   _id: courseId,
    //   studentsEnrolled: { $elemMatch: { $eq: userId } },
    // });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // check if user already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // create rating and review
    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // update course with this rating/review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { ratingAndReviews: ratingAndReview._id },
      },
      { new: true }
    )
      .populate("updatedCourseDetails")
      .exec();
    console.log(course);

    // send response
    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      data: ratingAndReview,
    });
  } catch (error) {
    console.log("Error in createRatingAndReview");
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get average rating and review
exports.getAverageRating = async (req, res) => {
  try {
  } catch (error) {}
};

// get all rating and review
exports.getAllRating = async (req, res) => {
  try {
  } catch (error) {}
};
