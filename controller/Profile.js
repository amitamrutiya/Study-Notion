const Profile = require("../models/Profile");
const User = require("../models/User");

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    // Get user id and data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    const { id } = req.user;

    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    } else if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Contact number and gender is required",
      });
    } else if (contactNumber.length < 10 || contactNumber.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Contact number should be 10 digits",
      });
    }

    // find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    // save profile
    await profileDetails.save();

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

