import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const cloudinaryUpload = async (localFilePath, folderName)  => {
    try {
      if(!localFilePath) return null;

      const result = await cloudinary.uploader.upload(localFilePath, {
        folder:folderName,
      });

      // remove local file after upload
      fs.unlinkSync(localFilePath);

      return {
        image_url: result.secure_url,
        image_id: result.public_id,
      };

    } catch (error) {
      fs.unlinkSync(localFilePath); //  delete local file if upload fails
      throw new Error("Cloudinary upload failed: " + error.message);
    }
}

export default cloudinaryUpload;