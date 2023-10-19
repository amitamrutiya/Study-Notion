const Tag = require("../models/Tag");

//create tag handler function
exports.createTag = async (req, res) => {
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

    //check if tag already exist
    const isExistingTag = Tag.findOne({ name });
    if (isExistingTag) {
      return res.status(400).json({
        success: false,
        message: "Tag already exist",
      });
    }

    //create tag
    const tagDetails = await Tag.create({ name, description });

    //return response
    res.status(200).json({
      success: true,
      message: "Tag created successfully",
      tagDetails,
    });
  } catch (error) {
    console.log("Error in creating tag: " + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getAlltags handler function
exports.showAlltags = async (req, res) => {
  try {
    //fetch all tags
    const allTags = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All tags return successfully",
      allTags,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
 