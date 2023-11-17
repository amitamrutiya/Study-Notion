import User from "../models/User.model.js";
import OTP from "../models/OTP.model.js";
import Profile from "../models/Profile.model.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender.js";
import passwordUpdated from "../mail/templates/passwordUpdate.js";

// require("dotenv").config();

// Send Otp
export async function sendOTP(req, res) {
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
      specialChars: false,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
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
}

// Singup
export async function signUp(req, res) {
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
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    console.log("recentOtp  " + recentOtp);
    //check if OTP is valid
    if (recentOtp.length === 0) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    } else if (recentOtp[0].otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    //Hash Password
    const hashedPawword = await bcrypt.hash(password, 10);

    // Create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

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
      contactNumber: contactNumber,
      password: hashedPawword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
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
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body; //get data from req body

    if (!email || !password) {
      // validate krlo means all inbox are filled or not;
      return res.status(403).json({
        success: false,
        message: "Please Fill up All the Required Fields",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails"); //user check exist or not
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registrered, please signup first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      //generate JWT, after password matching/comparing
      const payload = {
        // generate payload;
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        // generate token (combination of header , payload , signature)
        expiresIn: "20h", // set expiry time;
      });
      user.token = token;
      user.password = undefined;

      const options = {
        //create cookie and send response
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
}

// ChangePassword
export async function changePassword(req, res) {
  try {
    // Fetch data from request body
    const { oldPassword, newPassword } = req.body;
    const userDetails = await User.findById(req.user.id);

    // Validate data
    if (!userDetails || !oldPassword || !newPassword) {
      return res
        .status(403)
        .json({ success: false, message: "Please fill all the fields" });
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (isPasswordCorrect) {
      //Hash Password
      const hashedPawword = await bcrypt.hash(newPassword, 10);

      //update password
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: hashedPawword },
        { new: true }
      );

      //Send mail to user
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password updated successfully - [StudyNotion]",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
          )
        );
        console.log("Email sent successfully:", emailResponse.response);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        });
      }

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
}
