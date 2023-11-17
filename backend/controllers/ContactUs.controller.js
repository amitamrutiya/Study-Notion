import contactUsEmail from "../mail/templates/contactFormRes.js";
import mailSender from "../utils/mailSender.js";
// require("dotenv").config();

export async function contactUsController(req, res) {
  // fetch data
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;

  try {
    await mailSender(
      process.env.CONTACT_MAIL_ID,
      "Someone Send this data to you",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    return res.status(200).json({
      success: true,
      message: "Your data send successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong in contact us...",
    });
  }
}
