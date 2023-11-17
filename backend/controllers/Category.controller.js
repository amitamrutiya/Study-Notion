import Category from "../models/Category.model.js";

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//create category handler function
export async function createCategory(req, res) {
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
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to create category",
      });
    }

    //check if category already exist
    const isExistingCategory = await Category.findOne({ name });
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
}

//getAllcategories handler function
export async function showAllCategories(req, res) {
  try {
    //fetch all categories
    const allCategories = await Category.find();
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
}

// get category page details
export async function categoryPageDetails(req, res) {
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
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: ["ratingAndReviews", "instructor"],
      })
      .exec();

    //validation
    if (selectedCategory.courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // get courses of different category
    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: ["ratingAndReviews", "instructor"],
      })
      .exec();

    // Get top-selling courses across all categories
    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // send response
    return res.status(200).json({
      success: true,
      message: "Category page details",
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.log("Error in categoryPageDetails");
    return res.status(500).json({ success: false, message: error.message });
  }
}
