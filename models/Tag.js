const mongoose = require("mongoose");

const tagSchems = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Course",
  },
});

module.exports = mongoose.model("Tag", tagSchems);
