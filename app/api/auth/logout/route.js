// export async function GET() {
//     const response = new Response(
//       JSON.stringify({ message: "Đăng xuất thành công!" }),
//       { status: 200 }
//     );

//     // Xóa cookie bằng cách đặt Max-Age=0
//     response.headers.append("Set-Cookie", "authToken=; Path=/; HttpOnly; Secure; Max-Age=0");

//     return response;
//   }


import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Đăng xuất thành công!" });

  // Xóa cookie bằng cách set lại với Max-Age = 0 & Expires đã qua
  response.cookies.set("authToken", "", {
    path: "/",
    httpOnly: true,
    // secure: true,
    sameSite: "strict",
    expires: new Date(0), // Đảm bảo cookie hết hạn
  });

  return response;
}
