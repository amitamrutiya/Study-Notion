const mongoose = require("mongoose");

const courseProgressSchems = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("CourseProgress", courseProgressSchems);
