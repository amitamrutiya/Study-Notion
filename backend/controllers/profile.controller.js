import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import uploadFileToCloudinary from "../utils/fileUploader.js";
import convertSecondsToDuration from "../utils/secToDuration.js";

// Update Profile
export async function updateProfile (req, res) {
  try {
    // Get user id and data
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    const { id } = req.user;

    console.log("req.body", req.body);
    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    } else if (
      contactNumber &&
      (contactNumber.length < 10 || contactNumber.length > 10)
    ) {
      return res.status(400).json({
        success: false,
        message: "Contact number should be 10 digits",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update user
    const user = await User.findByIdAndUpdate(id, { firstName, lastName });
    await user.save();

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    // save profile
    await profileDetails.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // return response
    return res.status(201).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log("Error in updateProfile", error);
    res.status(500).json({
      success: false,
      message: "Unable to update profile",
      error: error.message,
    });
  }
}

export async function updateDisplayPicture (req, res) {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadFileToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000,
    );

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true },
    );

    res.send({
      success: true,
      message: "Image Updated successfully",
      updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getEnrolledCourses (req, res) {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSections",
          },
        },
      })
      .exec();
    userDetails = userDetails.toObject();
    let SubsectionLength = 0;
    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0;
      SubsectionLength = 0;
      for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSections.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0,
        );
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds,
        );
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSections.length;
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId,
      });
      courseProgressCount = courseProgressCount?.completedVideos.length;
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier,
          ) / multiplier;
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function instructorDashboard (req, res) {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course?.studentsEnrolled?.length;
      const totalAmountGenerated = totalStudentsEnrolled * course.price;

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalStudentsEnrolled, // Include other course properties as needed
        totalAmountGenerated,
      };
      return courseDataWithStats;
    });

    res.status(200).json({
      courses: courseData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}
