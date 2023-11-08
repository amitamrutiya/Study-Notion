const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadFileToCloudinary } = require("../utils/fileUploader");
require("dotenv").config();

// Create SubSection
exports.createSubSection = async (req, res) => {
  try {
    //fetch data from request body
    const { sectionId, title, description } = req.body;

    //extract file/video
    const video = req.files.video;

    //validation
    if (!sectionId || !title || !video || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check if section exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    //upload video to clodinary
    const uploadVideo = await uploadFileToCloudinary(
      video,
      process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER
    );
    //create a sub section
    const subSection = await SubSection.create({
      title,
      timeDuration: `${uploadVideo.duration}`,
      description,
      videoUrl: uploadVideo.secure_url,
    });

    //update section with this subsection ObjectId
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: { subSections: subSection._id },
      },
      { new: true }
    )
      .populate("subSections")
      .exec();

    //return response
    return res.status(201).json({
      success: true,
      message: "Subsection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error in createSubSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to create new subsection",
      error: error.message,
    });
  }
};

// update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    //fetch data from request body
    const { sectionId, subSectionId, title, description } = req.body;

    //validation
    if (!subSectionId) {
      return res.status(400).json({
        success: false,
        message: " SubSectionId is required",
      });
    }

    //check if subSection exist
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "subSection not found",
      });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    //extract file/video
    let videoUrl = null;

    //upload video to clodinary
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadVideo = await uploadFileToCloudinary(
        video,
        process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER
      );
      subSection.videoUrl = uploadVideo.secure_url;
      subSection.timeDuration = `${uploadVideo.duration}`;
    } else {
      subSection.videoUrl = subSection.videoUrl;
    }

    await subSection.save();
    const updatedSubSection = await Section.findById(sectionId).populate(
      "subSections"
    );

    //return response
    return res.status(201).json({
      success: true,
      message: "Subsection updated successfully",
      data: updatedSubSection,
    });
  } catch (error) {
    console.log("Error in updateSubSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to update subsection",
      error: error.message,
    });
  }
};

// delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    //fetch data from request body
    const { subSectionId, sectionId } = req.body;

    //validation
    if (!subSectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: " SubSectionId and sectionId are required",
      });
    }

    //check if subSection exist
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    //delete sub section
    await SubSection.findByIdAndDelete({ _id: subSectionId });

    // update Section with this subsection ObjectId

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: { subSections: subSectionId },
      },
      { new: true }
    );

    //return response
    return res.status(201).json({
      success: true,
      message: "Subsection updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error in deleteSection", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete subsection",
      error: error.message,
    });
  }
};

// get all SubSection
exports.getAllSubSections = async (req, res) => {
  try {
    //fetch data from request body
    const { sectionId } = req.body;

    //validation
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: " sectionId is required",
      });
    }

    //check if section exist
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    //get all sub sections
    const subSections = await SubSection.find({ sectionId });

    //return response
    return res.status(201).json({
      success: true,
      message: "Subsections fetched successfully",
      data: subSections,
    });
  } catch (error) {
    console.log("Error in getAllSubSections", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch subsections",
      error: error.message,
    });
  }
};
