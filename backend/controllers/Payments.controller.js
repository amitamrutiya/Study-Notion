import instance from "../config/razorpay.js";
import Course from "../models/course.model.js";
import CourseProgress from "../models/courseProgress.model.js";
import User from "../models/user.model.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail.js";
import mongoose from "mongoose";
import paymentSuccessEmail from "../mail/templates/paymentSuccessEmail.js";

//initiate the razorpay order
export async function capturePayment(req, res) {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({ success: false, message: "Please provide Course Id" });
  }
  let totalAmount = 0;

  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the course" });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }

      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, mesage: "Could not Initiate Order" });
  }
}

//verify the payment
export async function verifyPayment(req, res) {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(500).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" }); //return res
  }
  return res.status(200).json({ success: false, message: "Payment Failed" });
}

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide data for Courses or UserId",
    });
  }

  for (const courseId of courses) {
    try {
      //find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, message: "Course not Found" });
      }
      // created courseProgress for enrolled Courses in DB;
      const courseProgress = await CourseProgress.create({
        courseId,
        userId,
        completedVideos: [],
      });

      //find the student and add the course to their list of enrolledCOurses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId, courseProgress: courseProgress._id } },
        { new: true }
      );

      ///Send mail to the Student;
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName}`
        )
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export async function sendPaymentSuccessEmail(req, res) {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the fields" });
  }

  try {
    //student ko dhundo
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not send email" });
  }
}

// single item
// // capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//   // get courseId and User Id
//   const { courseId } = req.body;
//   const userId = req.user.id;

//   // validate course ID
//   if (!courseId) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Course ID is required" });
//   }

//   // validate courseDetail
//   let course;
//   try {
//     course = await Course.findById(courseId);
//     if (!course) {
//       return res
//         .status(400)
//         .json({ success: false, error: "Course not found" });
//     }

//     // user already pay for the same course
//     const uid = new mongoose.Type.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//       return res
//         .status(400)
//         .json({ success: false, error: "You already pay for this course" });
//     }
//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }

//   // create order
//   const amount = course.price * 100;
//   const currency = "INR";
//   const notes = {
//     courseId: courseId,
//     userId: userId,
//   };
//   const options = {
//     amount,
//     currency,
//     receipt: Math.random(Date.now()).toString(),
//     notes,
//   };
//   try {
//     // return response
//     let paymentResponse = await instance.orders.create(options);
//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       courseData: course.courseDescription,
//       thumbnail: course.thumbnail,
//       orderId: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//       message: "Payment Initiated",
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, error: err.message });
//   }
// };

// // verify the payment and enroll the user
// exports.verifyPayment = async (req, res) => {
//   const webhookSecret = "123456789";
//   const signature = req.headers["x-razorpay-signature"];
//   const shasum = crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");
//   if (digest !== signature) {
//     return res.status(400).json({
//       success: false,
//       error: "Transaction not legit!",
//     });
//   } else {
//     console.log("Transaction is legit");
//     const { courseId, userId } = req.body.payload.payment.entity.notes;

//     try {
//       // find the course and enrolled the student in it
//       const enrolledCourse = await Course.findByIdAndUpdate(
//         { _id: courseId },
//         { $push: { studentsEnrolled: userId } },
//         { new: true }
//       );

//       if (!enrolledCourse) {
//         return res.status(400).json({
//           success: false,
//           error: "Course not found",
//         });
//       }
//       console.log("enrolledCourse" + enrolledCourse);

//       // find the student and add enrolled the course in it
//       const enrolledStudent = await User.findByIdAndUpdate(
//         { _id: userId },
//         { $push: { courses: courseId } },
//         { new: true }
//       );

//       if (!enrolledStudent) {
//         return res.status(400).json({
//           success: false,
//           error: "Student not found",
//         });
//       }

//       console.log("enrolledStudent" + enrolledStudent);

//       // send the course enrollment email
//       const emailResponse = await mailSender(
//         enrolledStudent.email,
//         courseEnrollmentEmail(enrolledStudent.name, enrolledCourse.courseName)
//       );

//       console.log("emailResponse" + emailResponse);

//       return res.status(200).json({
//         success: true,
//         message: "Signature verified and Course enrolled successfully",
//       });
//     } catch (error) {
//       return res.status(500).json({ success: false, error: error.message });
//     }
//   }
// };
