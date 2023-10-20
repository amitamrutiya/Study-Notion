const Category = require("../models/Category");

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
exports.showAllcategories = async (req, res) => {
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
