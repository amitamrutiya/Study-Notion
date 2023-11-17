import { Schema, model } from "mongoose";

const subSectionSchems = new Schema({
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
    required: true,
  },
  videoUrl: {
    type: String,
  },
});

export const SubSection = model("SubSection", subSectionSchems);
