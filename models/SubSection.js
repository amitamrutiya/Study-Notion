const mongoose = require("mongoose");

const subSectionSchems = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("SubSection", subSectionSchems);
