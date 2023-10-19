const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPShema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

async function sendVerficationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verfication Email from StudyNotion",
      otp
    );
    console.log("Email sent Successfully: " + mailResponse.response);
  } catch (error) {
    console.log("Error in sending email" + error);
    throw error;
  }
}

OTPShema.pre("save", async function (next) {
  await sendVerficationEmail(this.email, this.otp);
  next();
});
module.exports = mongoose.model("OTP", OTPShema);
