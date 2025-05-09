// utils/cloudinaryUpload.js
import cloudinary from "../config/cloudinary.js";

const cloudinaryUpload = async (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          return reject(new Error("Cloudinary upload failed: " + error.message));
        }
        resolve({
          image_url: result.secure_url,
          image_id: result.public_id,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinaryUpload;
