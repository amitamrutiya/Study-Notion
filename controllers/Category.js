const Category = require("../models/Category");
const Course = require("../models/Course");

//create category handler function
exports.createCategory = async (req, res) => {
  try {
    //fetch name and description from request body
    const { name, description } = req.body;

    //validate data
    if (!name || !description) {
      return res.status(403).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    // check if user is admin then only create category
    if (req.user.accountType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create category",
      });
    }

    //check if category already exist
    const isExistingCategory = Category.findOne({ name });
    if (isExistingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exist",
      });
    }

    //create category
    const categoryDetails = await Category.create({ name, description });

    //return response
    res.status(200).json({
      success: true,
      message: "Category created successfully",
      categoryDetails,
    });
  } catch (error) {
    console.log("Error in creating category: " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAllcategories handler function
exports.showAllCategories = async (req, res) => {
  try {
    //fetch all categories
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    res.status(200).json({
      success: true,
      message: "All categories return successfully",
      allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get categoryId
    const { categoryId } = req.body;

    // validate data
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Please provide category id",
      });
    }

    // get category details
    const selectedCategory = await Category.findById(categoryId, { new: true })
      .populate("courses")
      .exec();

    //validation
    if (!selectedCategory) {
      return res.status(400).json({
        success: false,
        message: "Data not found",
      });
    }

    // get courses of different category
    const otherCategories = await Category.find(
      { _id: { $ne: categoryId } },
      { new: true }
    )
      .populate("courses")
      .exec();

    // get top selling courses
    const topSellingCourses = await Course.find({ status: "Published" })
      .populate("category")
      .populate("instructor")
      .populate("ratingAndReviews")
      .populate("studentsEnrolled")
      .sort({ studentsEnrolled: -1 })
      .limit(7)
      .exec();

    // send response
    return res.status(200).json({
      success: true,
      message: "Category page details",
      data: {
        otherCategories,
        selectedCategory,
        topSellingCourses,
      },
    });
  } catch (error) {
    console.log("Error in categoryPageDetails");
    return res.status(500).json({ success: false, message: error.message });
  }
};
