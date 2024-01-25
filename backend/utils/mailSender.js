import nodemailer from "nodemailer";

export default async function mailSender(email, title, body) {
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
      from: "StudyNotion 📖 - by Amit Kumar",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
  }
}
