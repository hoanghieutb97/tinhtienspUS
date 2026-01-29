

import cloudinary from '../../../lib/cloudinary';

export async function POST(req) {
  try {
    const body = await req.json();
    const { base64File } = body;


    if (!base64File) {
      return new Response(JSON.stringify({ success: false, error: 'No file provided' }), { status: 400 });
    }

    // Upload file lên Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64File, {
      folder: 'vatlieu', // Thư mục lưu trữ trên Cloudinary
      transformation: [
        { width: 400, height: 400, crop: 'limit' } // Giới hạn kích thước tối đa 300x300
      ],
    });

    return new Response(JSON.stringify({ success: true, url: uploadResponse.secure_url }), { status: 200 });
  } catch (error) {
    console.error('Upload Error:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to upload image' }), { status: 500 });
  }
}

export function GET() {
  return new Response(JSON.stringify({ message: 'GET method is not supported' }), { status: 405 });
}
