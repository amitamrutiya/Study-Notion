const Section = require("../models/Section");
const Course = require("../models/Course");

// Create Section
exports.createSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, courseId } = req.body;

    //data validation
    if (!sectionName || !courseId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    //check if course exist
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }
    //create Section
    const newSection = await Section.create({ courseId, sectionName });

    //update course with newSection
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate("courseContent")
      .exec();

    //send response
    res.status(201).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log("Error in createSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to create new section",
      error: error.message,
    });
  }
};

// Update Section
exports.updateSection = async (req, res) => {
  try {
    //data fetch
    const { sectionName, sectionId } = req.body;

    //data validation
    if (!sectionName || !sectionId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    //check if section exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, error: "Section not found" });
    }

    //update Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    //send response
    res.status(201).json({
      success: true,
      message: "Section updated successfully",
      updatedSection,
    });
  } catch (error) {
    console.log("Error in updateSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to update new section",
      error: error.message,
    });
  }
};

// Delete Section
exports.deleteSection = async (req, res) => {
  try {
    //data fetch
    const { sectionId } = req.body;

    //data validation
    if (!sectionId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    //check if section exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, error: "Section not found" });
    }

    //delete Section
    const deletedSection = await Section.findByIdAndDelete(sectionId);

    //TODO: maybe it can give you error
    //update course with new deleted Section
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      section.courseId,
      { $pull: { courseContent: deletedSection._id } },
      { new: true }
    )
      .populate("courseContent")
      .exec();

    //send response
    res.status(201).json({
      success: true,
      message: "Section deleted successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log("Error in deleteSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to Delete section",
      error: error.message,
    });
  }
};

// Get All Sections
ecports.getAllSections = async (req, res) => {
  try {
    //data fetch
    const { courseId } = req.body;

    //data validation
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    //check if course exist
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    //get all Sections
    const sections = await Section.find({ courseId });

    //send response
    res.status(201).json({
      success: true,
      message: "All Sections",
      sections,
    });
  } catch (error) {
    console.log("Error in getAllSections", error);
    res.status(500).json({
      success: false,
      message: "Unable to get all sections",
      error: error.message,
    });
  }
};
