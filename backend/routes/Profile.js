import { Router } from 'express'

import { auth, isInstructor } from '../middlewares/auth.middelware.js'
import {
  updateProfile,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard
} from '../controllers/profile.controller.js'
const router = Router()

//  Profile routes
router.put('/updateProfile', auth, updateProfile)
router.get('/getEnrolledCourses', auth, getEnrolledCourses)
router.put('/updateDisplayPicture', auth, updateDisplayPicture)
router.get('/instructorDashboard', auth, isInstructor, instructorDashboard)

export default router
