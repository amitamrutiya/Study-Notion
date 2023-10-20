const nodemailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    // create transporter object
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "StudyNotion 📖 - by Amit",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    return info;
  } catch (error) {
    console.log(error);
  }
};

module.exports = mailSender;
