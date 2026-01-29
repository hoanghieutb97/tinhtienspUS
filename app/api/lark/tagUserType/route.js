import { repplyMessage } from '@/lib/larkUtils';



export async function POST(req) {

  const { type, ID_Messenger, userMess } = await req.json(); // Lấy URL ảnh và chat ID từ body request




  try {
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

  }
}
