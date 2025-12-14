import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage for Audio + Images
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "AudioComments",
            resource_type: "auto",   // 👈 IMPORTANT for audio
            allowedFormats: ["jpg", "png", "jpeg", "mp3", "wav", "m4a", "aac", "ogg"], // extend audio formats
            public_id: Date.now() + "-" + file.originalname, // optional: clean filenames
        };
    },
});

export const upload = multer({ storage });

export default { cloudinary, upload };
