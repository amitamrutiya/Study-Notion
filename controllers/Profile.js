const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

// Update Profile
exports.updateProfile = async (req, res) => {
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
      data: profileDetails,
    });
  } catch (error) {
    console.log("Error in updateProfile", error);
    res.status(500).json({
      success: false,
      message: "Unable to update profile",
      error: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadFileToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};