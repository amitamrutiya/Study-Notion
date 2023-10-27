const mongoose = require("mongoose");

const sectionSchems = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  subSections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

module.exports = mongoose.model("Section", sectionSchems);
