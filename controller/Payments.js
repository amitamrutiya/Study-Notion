const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");

// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  // get courseId and User Id
  const { courseId } = req.body;
  const userId = req.user.id;

  // validate course ID
  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, error: "Course ID is required" });
  }

  // validate courseDetail
  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(400)
        .json({ success: false, error: "Course not found" });
    }

    // user already pay for the same course
    const uid = new mongoose.Type.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res
        .status(400)
        .json({ success: false, error: "You already pay for this course" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }

  // create order
  const amount = course.price * 100;
  const currency = "INR";
  const notes = {
    courseId: courseId,
    userId: userId,
  };
  const options = {
    amount,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes,
  };
  try {
    // return response
    let paymentResponse = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseData: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      message: "Payment Initiated",
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// verify the payment and enroll the user
exports.verifyPayment = async (req, res) => {
  const webhookSecret = "123456789";
  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  if (digest !== signature) {
    return res.status(400).json({
      success: false,
      error: "Transaction not legit!",
    });
  } else {
    console.log("Transaction is legit");
    const { courseId, userId } = req.body.payload.payment.entity.notes;

    try {
      // find the course and enrolled the student in it
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(400).json({
          success: false,
          error: "Course not found",
        });
      }
      console.log("enrolledCourse" + enrolledCourse);

      // find the student and add enrolled the course in it
      const enrolledStudent = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );

      if (!enrolledStudent) {
        return res.status(400).json({
          success: false,
          error: "Student not found",
        });
      }

      console.log("enrolledStudent" + enrolledStudent);

      // send the course enrollment email
      const emailResponse = await mailSender(
        enrolledStudent.email,
        courseEnrollmentEmail(enrolledStudent.name, enrolledCourse.courseName)
      );
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};
