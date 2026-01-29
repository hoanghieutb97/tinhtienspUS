import { downloadImage, uploadImageToLark, sendImageMessage, repplyMessage } from '@/lib/larkUtils';
import path from 'path';
import axios from 'axios';
import fs from 'fs';


export async function POST(req) {
  let chatId = process.env.LARK_CHAT_ID;
  const { imageUrl, product, type, userMess } = await req.json(); // Lấy URL ảnh và chat ID từ body request
  

  const imagePath = path.join(process.cwd(), 'public', 'downloads', 'downloaded_image.jpg');

  try {



    // // Tải ảnh từ URL về máy
    let statusDownIMG = await downloadImage(imageUrl, imagePath);


    //   // Upload ảnh lên Lark để lấy image_key
    const imageKey = await uploadImageToLark(imagePath);

    // Gửi tin nhắn có ảnh
    const ID_Messenger = await sendImageMessage(chatId, imageKey, product, userMess);
    const repply_Message = await repplyMessage(ID_Messenger, userMess, type);



    return new Response(JSON.stringify({ message: 'Image message sent successfully!', ID_Messenger }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    // Xóa ảnh tạm sau khi upload
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
}
