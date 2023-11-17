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

export default Section = model("Section", sectionSchems);
