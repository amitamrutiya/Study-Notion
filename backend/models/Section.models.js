import { Schema, model } from "mongoose";

const sectionSchems = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  subSections: [
    {
      type: Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export const Section = model("Section", sectionSchems);
