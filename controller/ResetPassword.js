const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcryptjs");

// ResetPasswordToken
exports.resetPasswordToken = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    //check if user already exist
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `http://localhost:3000/update-password/${token}`;

    //send email to user
    await mailSender(
      email,
      "Reset Password Email from StudyNotion",
      `Password reset link: ${url}`
    );

    //return response successful
    res.status(200).json({
      success: true,
      message: "Reset Password Email sent successfully",
    });
  } catch (error) {
    console.log("Error in sending reset password email: " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ResetPassword
exports.resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;

    //validation
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "Fields are required",
      });
    } else if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    //get userdetails from db using token
    const userDetails = await User.findOne({ token });

    // if no entry - invalid token
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    //token time expires
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user password
    await User.findOneAndUpdate(
      { token },
      { password: hashedPassword },
      { new: true }
    );

    // return response successful
    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log("Error in reset password: " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

