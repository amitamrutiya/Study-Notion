const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>OTP Verfication Email</title>
            <style>
            body {
                background-color: #ffffff;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
                color: #333333;
            }

            .container {
                text-align: center;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }

            .logo {
                max-width: 200px;
                margin-bottom: 20px;
            }

            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }

            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }

            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }

            .highlight {
                font-weight: bold;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <a href="https://studynotion-edtech-project.vercel.app"
                ><img
                class="logo"
                src="https://i.ibb.co/7Xyj3PC/logo.png"
                alt="StudyNotion Logo"
            /></a>
            <div class="message">OTP Verfication Email</div>
            <div class="body">
                <p>Dear User,</p>
                <p>
                Thank you for registering with StudyNotion. To complete your
                registration, please enter the following OTP in the app to verify your
                account:.
                </p>
                <h2 class="highlight">${otp}</h2>
                <p>
                This OTP is valid for 5 minuts. If you did not requrest this
                verfication, please disregard this email. Once your account is
                verified, you will be able to access all the features of StudyNotion.
                </p>
            </div>
            <div class="support">
                lf you have any questions or need further assistance, please feel free
                to reach at
                <a href="mailto:info@studynotion.com">info@studynotion.com</a>. We are
                here to help!
            </div>
            </div>
        </body>
        </html>
        `;
};
