import Course from '../models/course.model.js'
import Category from '../models/category.model.js'
import User from '../models/user.model.js'
import SubSection from '../models/subSection.model.js'
import Section from '../models/section.model.js'
import CourseProgress from '../models/courseProgress.model.js'
import uploadFileToCloudinary from '../utils/fileUploader.js'
import convertSecondsToDuration from '../utils/secToDuration.js'

// createCourse handler function
export async function createCourse (req, res) {
  try {
    // fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tags,
      // totalDuration,
      language,
      status,
      instructions,
    } = req.body

    // get thumbnail
    const thumbnail = req.files.thumbnailImage
    const tagList = tags ? JSON.parse(tags) : []
    const instructionList = instructions ? JSON.parse(instructions) : []

    // validate data
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !language ||
      !instructionList.length ||
      !thumbnail ||
      !tagList.length
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Please enter all the fields' })
    }
    if (!status || status === undefined) {
      status = 'Draft'
    }
    // Check for instructor
    const instructorDetails = await User.findById(req.user.id, {
      accountType: 'Instructor',
    })
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: 'You are not authorized to create course',
      })
    }

    // check for category
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid category',
      })
    }

    // upload thumbnail to cloudinary
    const thumbnailImage = await uploadFileToCloudinary(
      thumbnail,
      process.env.CLOUDINARY_COURSE_THUMBNAIL_FOLDER,
    )

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      thumbnail: thumbnailImage.secure_url,
      category: categoryDetails._id,
      tags: tagList,
      language,
      // totalDuration,
      status,
      instructions: instructionList,
    })

    // push course id to instructor's course array
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true },
    )

    // update category schema
    await Category.findByIdAndUpdate(
      category,
      { $push: { courses: newCourse._id } },
      { new: true },
    )

    // send response
    return res.status(200).json({
      success: true,
      message: 'Course created successfully',
      data: newCourse,
    })
  } catch (error) {
    console.log('Error in creating course: ' + error)
    return res.status(500).json({
      success: false,
      message: 'Error on createCourse controller: ' + error,
    })
  }
}

// getAllCourse handler function
export async function getAllCourses (req, res) {
  try {
    const allCourses = await Course.find(
      { status: 'Published' },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        category: true,
        studentsEnrolled: true,
      },
    )
      .populate('instructor')
      .exec()

    return res.status(200).json({
      success: true,
      message: 'All courses fetched successfully',
      data: allCourses,
    })
  } catch (error) {
    console.log('Error in showAllCourses controller: ')
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// getCourseDetails handler function
export async function getCourseDetails (req, res) {
  try {
    // get id
    const { courseId } = req.body

    // validate data
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Please give course Id',
      })
    }

    // find course details
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: 'instructor',
        populate: { path: 'additionalDetails' },
      })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: { path: 'subSections' },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course details with ${courseId}`,
      })
    }
    let totalDuration
    if (courseDetails.courseContent.length) {
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSections.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })

      totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    }

    // send response
    return res.status(200).json({
      success: true,
      message: 'Course details fetched successfully',
      data: { courseDetails, totalDuration },
    })
  } catch (error) {
    console.log('Error in getCourseDetails controller: ')
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

export async function getFullCourseDetails (req, res) {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: 'instructor',
        populate: {
          path: 'additionalDetails',
        },
      })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSections',
        },
      })
      .exec()
    const courseProgressCount = await CourseProgress.findOne({
      courseId,
      userId,
    })

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }
    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
export async function getInstructorCourses (req, res) {
  try {
    const instructorId = req.user.id // Get the instructor ID from the authenticated user or request body

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSections',
        },
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      // Return the instructor's courses
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor courses',
      error: error.message,
    })
  }
}

export async function deleteCourse (req, res) {
  try {
    const { courseId } = req.body

    const course = await Course.findById(courseId) // Find the course
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const studentsEnrolled = course.studentsEnrolled // Unenroll students from the course
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } })
    }

    const courseSections = course.courseContent // Delete sections and sub-sections
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId) // Delete sub-sections of the section
      if (section) {
        const subSections = section.subSections
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      await Section.findByIdAndDelete(sectionId) // Delete the section
    }

    await Course.findByIdAndDelete(courseId) // Delete the course

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// Edit Course Details
export async function editCourse (req, res) {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadFileToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === 'tags' || key === 'instructions') {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save() // save the course;

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: 'instructor',
        populate: {
          path: 'additionalDetails',
        },
      })
      .populate('category')
      .populate('ratingAndReviews')
      .populate({
        path: 'courseContent',
        populate: {
          path: 'subSections',
        },
      })
      .exec()

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
}
