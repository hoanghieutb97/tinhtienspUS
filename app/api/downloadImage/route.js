import axios from 'axios';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    const imageUrl = req.nextUrl.searchParams.get('url'); // Lấy URL ảnh từ query
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    // Đường dẫn lưu ảnh
    const filePath = path.join(process.cwd(), 'public', 'downloads', 'downloaded_image.JPEG');

    // Tạo thư mục nếu chưa tồn tại
    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Tải ảnh về và lưu
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    // Đợi ghi file hoàn tất
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return new Response(JSON.stringify({ message: 'Image downloaded successfully', filePath }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error downloading image:', error);
    return new Response(JSON.stringify({ error: 'Failed to download image' }), { status: 500 });
  }
}
