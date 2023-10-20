const cloudinary = require("cloudinary").v2;

exports.uploadFileToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }

    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.log("Error in uploading image to cloudinary: " + error);
    throw error;
  }
};
