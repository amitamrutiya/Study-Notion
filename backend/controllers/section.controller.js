import Section from "../models/section.model.js";
import Course from "../models/course.model.js";
import SubSection from "../models/subSection.model.js";

// Create Section
export async function createSection (req, res) {
  try {
    // data fetch
    const { sectionName, courseId } = req.body;

    // data validation
    if (!sectionName || !courseId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // check if course exist
    const course = await Course.findById({ _id: courseId });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    // create Section
    const newSection = await Section.create({ sectionName });

    // update course with newSection
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true },
    )
      .populate({
        path: "courseContent",
        populate: { path: "subSections" },
      })
      .exec();

    // send response
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
}

// Update Section
export async function updateSection (req, res) {
  try {
    // data fetch
    const { sectionName, sectionId, courseId } = req.body;

    // data validation
    if (!sectionName || !sectionId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // check if section exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, error: "Section not found" });
    }

    // update Section
    await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true },
    );

    // update course with EditSection
    const updatedCourseDetails = await Course.findByIdAndUpdate(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSections" },
      })
      .exec();

    // send response
    res.status(201).json({
      success: true,
      message: "SubSection Edited successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    console.log("Error in updateSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to update new section",
      error: error.message,
    });
  }
}

// Delete Section
export async function deleteSection (req, res) {
  try {
    // data fetch
    const { sectionId, courseId } = req.body;

    // data validation
    if (!sectionId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // check if section exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, error: "Section not found" });
    }

    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // delete sub section
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    // delete Section
    await Section.findByIdAndDelete(sectionId);

    // find the updated course and return
    const updatedCourseDetails = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSections",
        },
      })
      .exec();

    // send response
    return res.status(201).json({
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
}

// Get All Sections
export async function getAllSections (req, res) {
  try {
    // data fetch
    const { courseId } = req.body;

    // data validation
    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // check if course exist
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }

    // get all Sections
    const sections = await Section.find({ courseId });

    // send response
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
}
