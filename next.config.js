/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Tắt React Strict Mode
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Thêm hostname của Cloudinary
      },
    ],
  },
};

module.exports = nextConfig;
