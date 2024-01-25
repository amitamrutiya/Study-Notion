import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice.js'
import profileReducer from '../slices/profileSlice.js'
import cartReducer from '../slices/cartSlice.js'
import courseReducer from '../slices/courseSlice.js'
import viewCourseReducer from '../slices/viewCourseSlice.js'

const rootReducer = combineReducers({
  // combining all reducer;
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,
  course: courseReducer,
  viewCourse: viewCourseReducer
})

export default rootReducer
