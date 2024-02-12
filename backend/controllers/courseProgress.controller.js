import SubSection from "../models/subSection.model.js";
import CourseProgress from "../models/courseProgress.model.js";

export async function updateCourseProgress (req, res) {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid subsection" });
    }
    // Find the course progress document for the user and course
    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      });
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res
          .status(400)
          .json({ success: false, error: "Subsection already completed" });
      }
      courseProgress.completedVideos.push(subsectionId); // Push the subsection into the completedVideos array
    }

    await courseProgress.save(); // Save the updated course progress

    return res
      .status(200)
      .json({ success: true, message: "Course progress updated" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: true, error: "Internal server error" });
  }
}
