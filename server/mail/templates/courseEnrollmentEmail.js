exports.courseEnrollmentEmail = (courseName, name, instructorName) => {
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

            .cta {
                display: inline-block;
                padding: 10px 20px;
                background-color: #ffd60a;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
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
            <div class="message">Course Registration Confirmation</div>
            <div class="body">
                <p>Dear ${name},</p>
                <p>
                You have successfully registered for the course
                <span class="highlight">${courseName}</span> with
                <span class="highlight">${instructorName}</span>. We are excited to
                have you as a participant!
                </p>
                <p>
                Please log in to your learning dashboard to access the course
                materials and start your learnings.
                </p>
                <a
                class="cta"
                href="https://studynotion-edtech-project.vercel.app/dashboard"
                >Go to Dashboard</a
                >
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
