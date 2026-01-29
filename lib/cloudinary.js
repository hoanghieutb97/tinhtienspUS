import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Thay bằng Cloud Name
  api_key: process.env.CLOUDINARY_API_KEY,      // Thay bằng API Key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Thay bằng API Secret
});

export default cloudinary;
