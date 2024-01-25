import { Schema, model } from 'mongoose'

const profileSchems = new Schema({
  gender: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  about: {
    type: String,
    trim: true
  },
  contactNumber: {
    type: Number,
    trim: true
  }
})

export default model('Profile', profileSchems)
