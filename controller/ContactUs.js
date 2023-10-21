const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

exports.contactUsController = async (req, res) => {
  // fetch data
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;

  try {
    await mailSender(
      email,
      "Your data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    await mailSender(
      process.env.CONTACT_MAIL_ID,
      "Someone Send this data to you",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong in contact us...",
      });
  }
};
