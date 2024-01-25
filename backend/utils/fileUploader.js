import { v2 as cloudinary } from 'cloudinary'

// Upload any files and images to cloudinary
export default async function uploadFileToCloudinary (file, folder, height, quality) {
  try {
    const options = { folder }

    if (height) {
      options.height = height
    }
    if (quality) {
      options.quality = quality
    }

    options.resource_type = 'auto'

    return await cloudinary.uploader.upload(file.tempFilePath, options)
  } catch (error) {
    console.log('Error in uploading image to cloudinary: ' + error.message)
    throw error
  }
}
