import { Schema, model } from "mongoose";

const tagsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

export const Tag = model("Tag", tagsSchema);
