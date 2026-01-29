import fetch from 'node-fetch';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
const lark = require('@larksuiteoapi/node-sdk');
import { getToken } from '@/lib/tokenCache';
const { Readable } = require('stream');
const streamPipeline = promisify(pipeline);

export async function downloadImage(url, filePath) {

    try {

        // Tải ảnh về và lưu
        const response = await axios({
            url: url,
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
        return true
    } catch (error) {
        console.error('Error downloading image:', error);
        return false


    }

}

export async function uploadImageToLark(filePath) {
    let token_Lark = await getToken();



    const client = new lark.Client({

        appId: process.env.LARK_ID,
        appSecret: process.env.LARK_SECRET,
        disableTokenCache: true
    });
    const file = fs.readFileSync(filePath);

    const stream = Readable.from(file);
    try {
        // Gọi API upload ảnh
        const response = await client.im.image.create(
            {
                data: {
                    image_type: 'message',
                    image: stream,
                },
            },
            lark.withTenantToken(token_Lark)
        );

  
        return response.image_key; // Trả về image_key sau khi upload thành công
    } catch (e) {
        console.error("Lỗi khi upload ảnh:", e.response ? e.response.data : e.message);
        throw new Error("Không thể upload ảnh lên Lark");
    }
}

// Hàm gửi tin nhắn có ảnh
export async function sendImageMessage(chatId, imageKey, product) {
    let token_Lark = await getToken();


    const client = new lark.Client({
        appId: process.env.LARK_ID,
        appSecret: process.env.LARK_SECRET,
        disableTokenCache: true,
    });

    const payload = {
        params: {
            receive_id_type: 'chat_id',
        },
        data: {
            receive_id: chatId,
            msg_type: "interactive",
            content: JSON.stringify({                           // Nội dung phải là chuỗi JSON
                config: {
                    wide_screen_mode: false,
                },
                elements: [
                    {
                        tag: "div",
                        text: {
                            tag: "lark_md",
                            content: product, // Nội dung chữ
                        },
                    },
                    {
                        tag: "img",
                        img_key: imageKey, // Image key
                        mode: "fit_center", // Giữ ảnh trong kích thước vừa phải
                        // alt: {
                        //     tag: "BOT",
                        //     content: "TB: Sản phẩm mới",
                        // },
                    },

                ],
            })

        }
    }

    try {
        const response = await client.im.message.create(payload, lark.withTenantToken(token_Lark));
        
        return response.data.message_id;
    } catch (error) {
        console.error("Lỗi chi tiết:", JSON.stringify(error.response?.data?.error || error.message, null, 2));
        return false;
    }


}


// hàm repply tin nhắn
export async function repplyMessage(ID_Messenger, userMess, type) {
    let token_Lark = await getToken();

    


    const client = new lark.Client({
        appId: process.env.LARK_ID,
        appSecret: process.env.LARK_SECRET,
        disableTokenCache: true
    });


    client.im.message.reply({
        path: {
            message_id: ID_Messenger,
        },
        data: {

            content: JSON.stringify({
                text: `${userMess
                    .map(userId => `<at user_id="${userId}"></at>`)
                    .join(" ")}: Xử lý trạng thái ${type}`
            }),
            msg_type: 'text',
            reply_in_thread: true,

        },
    },
        lark.withTenantToken(token_Lark)
    ).then(res => {

    }).catch(e => {
        console.error(JSON.stringify(e.response.data, null, 4));
    });

}
