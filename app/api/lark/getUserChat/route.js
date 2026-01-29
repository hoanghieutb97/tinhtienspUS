
const axios = require('axios');
import { getToken } from '@/lib/tokenCache';

export async function GET(req) {
  let chatId = process.env.LARK_CHAT_ID;
  let token_Lark = await getToken();


  let config = {
    method: 'get',
    url: `https://open.feishu.cn/open-apis/im/v1/chats/${chatId}/members`,
    headers: {
      'Authorization': `Bearer ${token_Lark}`
    }
  };

  return axios.request(config)
    .then((response) => {
      
      return new Response(JSON.stringify({ message: 'member lark successfully!', data: response.data.data.items }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    })
    .catch((error) => {
      console.log(error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    });





}
