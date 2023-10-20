const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

//Send Otp
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request body
    const { email } = req.body;

    //validate data
    if (!email) {
      return res
        .status(403)
        .json({ success: false, message: "Please fill all the fields" });
    }

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    //if user laready exist then return a response
    if (checkUserPresent) {
      return res
        .status(401)
        .json({ success: true, message: "User already exist" });
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    console.log("OTP generated: " + otp);

    //check if otp already exist
    // TODO 1: this is not a good way to check if otp already exist make it more efficient by bruteforce
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
        alphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    //save otp to database
    const otpBody = await OTP.create({ email, otp });

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      data: otpBody,
    });
  } catch (error) {
    console.log("Error in sending OTP: " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Singup
exports.signUp = async (req, res) => {
  try {
    //data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Please fill all the fields" });
    }

    //match 2 password
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    //check if user already exist
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exist" });
    }

    //find most recent OTP stored for the user
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    //check if OTP is valid
    if (recentOtp.otp.length === 0) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    } else if (recentOtp.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    //Hash Password
    const hashedPawword = await bcrypt.hash(password, 10);

    //save user to database
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber ?? null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPawword,
      accountType,
      additionalDetails: profileDetails._id,
      contactNumber: contactNumber ?? null,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}+${lastName}`,
    });

    //return response
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in creating user: " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Login
exports.login = async (req, res) => {
  try {
    //fetch data from request body
    const { email, password } = req.body;

    //validate data
    if (!email || !password) {
      return res
        .status(403)
        .json({ success: false, message: "Please fill all the fields" });
    }

    //check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist, please signup first",
      });
    }

    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      //genreate JWT token
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        token,
        data: user,
        success: true,
        message: "User logged in successfully",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //return response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in logging in user: " + error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//ChangePassowrd
exports.changePassowrd = async (req, res) => {
  try {
    //fetch data from request body
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    //validate data
    if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(403)
        .json({ success: false, message: "Please fill all the fields" });
    }

    //check if user exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist, please signup first",
      });
    }

    //check if password is correct
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (isPasswordCorrect) {
      //match 2 password
      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Password does not match" });
      }

      //Hash Password
      const hashedPawword = await bcrypt.hash(newPassword, 10);

      //update password
      await User.findByIdAndUpdate(user._id, { password: hashedPawword });

      //Send mail to user
      await mailSender(
        email,
        "Password Changed Successfully",
        "Your password has been changed successfully"
      );

      //return response
      res.status(200).json({
        success: true,
        message: "Password changed successfully",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Password not correct" });
    }
  } catch (error) {
    console.log("Error in changing password: " + error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

