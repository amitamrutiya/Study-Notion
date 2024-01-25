import { Schema, model } from 'mongoose'

const ratingAndReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
})

export default model('RatingAndReview', ratingAndReviewSchema)
