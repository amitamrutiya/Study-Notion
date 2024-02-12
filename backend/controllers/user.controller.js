import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import Course from "../models/course.model.js"
import mongoose from "mongoose"

// Delete Account
export async function deleteUserAccount (req, res) {
  try {
    // Get user id
    const { id } = req.user

    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      })
    }

    // find profile
    const userDetails = await User.findById(id)
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
    }

    const profileId = userDetails.additionalDetails
    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: "Profile not found",
      })
    }

    // if user is students then remove from enrolled courses
    if (req.user.accountType === "Student") {
      for (const courseId of userDetails.courses) {
        await Course.findByIdAndUpdate(
          courseId,
          { $pull: { studentsEnrolled: id } },
          { new: true },
        )
      }
    }
    // delete profile and account
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(profileId),
    })
    await User.findByIdAndDelete({ _id: id })

    // return response
    return res.status(201).json({
      success: true,
      message: "Account deleted successfully",
    })
  } catch (error) {
    console.log("Error in deleteAccount", error)
    res.status(500).json({
      success: false,
      message: "Unable to delete Account",
      error: error.message,
    })
  }
}

// Get User Details
export async function getAllUserDetails (req, res) {
  try {
    // get id
    const { id } = req.user
    console.log("id", id)
    // validation and get user details
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      })
    }
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    // return response
    return res.status(201).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    console.log("Error in getUserDetails", error)
    res.status(500).json({
      success: false,
      message: "Unable to fetch user details",
      error: error.message,
    })
  }
}
