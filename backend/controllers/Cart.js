const User = require("../models/User");

exports.addCourseIntoCart = async (req, res) => {
  try {
    const { courseId, userId } = req.body;
    const user = await User.findById(userId);

    if (courseId === undefined || userId === undefined) {
      return res.status(400).json({
        success: false,
        message: "courseId or userId is undefined",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.cartAddedCourses.push(courseId);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Course added to cart",
    });
  } catch (error) {
    console.log("Error in addCourseIntoCart: " + error);
    return res.status(500).json({
      success: false,
      message: "Error on addCourseIntoCart controller: " + error,
    });
  }
};

exports.removeCourseFromCart = async (req, res) => {
  const { courseId, userId } = req.body;

  if (courseId === undefined || userId === undefined) {
    return res.status(400).json({
      success: false,
      message: "courseId or userId is undefined",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.cartAddedCourses.pull(courseId);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Course removed from cart",
    });
  } catch (error) {
    console.log("Error in removeFromCart: " + error);
    return res.status(500).json({
      success: false,
      message: "Error on removeFromCart controller: " + error,
    });
  }
};

exports.clearCart = async (req, res) => {
  const { userId } = req.body;

  if (userId === undefined) {
    return res.status(400).json({
      success: false,
      message: "userId is undefined",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.cartAddedCourses = [];
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    console.log("Error in clearCart: " + error);
    return res.status(500).json({
      success: false,
      message: "Error on clearCart controller: " + error,
    });
  }
};