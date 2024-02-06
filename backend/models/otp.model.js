import { Schema, model } from 'mongoose'
import mailSender from '../utils/mailSender.js'
import otpTemplate from '../mail/templates/emailVerficationTemplate.js'

const OTPShema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
})

async function sendVerificationEmail (email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      'Verification Email from StudyNotion',
      otpTemplate(otp),
    )
    console.log('Email sent Successfully: ', mailResponse)
  } catch (error) {
    console.log('error occured while sending mails: ', error)
    throw error
  }
}

OTPShema.pre('save', async function (next) {
  await sendVerificationEmail(this.email, this.otp)
  next()
})

export default model('OTP', OTPShema)
