const mongoose = require("mongoose");

const courseProgressSchems = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
  completedVideos:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ]
});

module.exports = mongoose.model("CourseProgress", courseProgressSchems);
