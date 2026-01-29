import cron from 'node-cron';
import fetch from 'node-fetch';

let token = null;
let tokenExpiry = 0; // Lưu thời gian hết hạn token

// Hàm làm mới token
async function refreshToken() {

    
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: process.env.LARK_ID,
        app_secret: process.env.LARK_SECRET,
      }),
    });

    const data = await response.json();
    if (data.code === 0) {
      token = data.tenant_access_token;
      tokenExpiry = Date.now() + data.expire * 10000; // Cập nhật thời gian hết hạn
      console.log('Token refreshed:', token);
    } else {
      console.error('Failed to refresh token:', data);
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}

// Hàm đồng bộ kiểm tra và trả về token
export async function getToken() {
  // Làm mới token nếu chưa có hoặc sắp hết hạn
  if (!token || Date.now() >= tokenExpiry - 60000) { // Làm mới trước khi hết hạn 1 phút
    console.log('Refreshing token...');
    await refreshToken();
  }
  return token;
}

// Đặt cron để tự động làm mới token mỗi 2 giờ
cron.schedule('0 */2 * * *', refreshToken);

// Làm mới token ngay khi app khởi động
refreshToken();
