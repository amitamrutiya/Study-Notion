import { Schema, model } from 'mongoose'

const courseProgressSchems = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  completedVideos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SubSection'
    }
  ]
})

export default model('CourseProgress', courseProgressSchems)
