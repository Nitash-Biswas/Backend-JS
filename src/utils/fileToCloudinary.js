import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
//fs stands for file system

// Configuration for using Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

function getPublicId(url) {
    // This regex captures the part after '/upload/' and before the file extension
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return match ? match[1] : null;
  }

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file has been uploaded
        //console.log("File is uploaded on cloudinary", response.url)
        fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)    // remove the locally saved temporary file as the upload operation got failed.
        return null;
    }
};

const deleteFromCloudinary = async(publicUrl) => {
    try {
        const result = await cloudinary.uploader.destroy(publicUrl)
        return result
    } catch (error) {
        console.log("Error while deleting from Cloudinary", error)
    }
}
export {uploadOnCloudinary, getPublicId, deleteFromCloudinary}