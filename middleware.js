// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const token = req.cookies.get("authToken"); // Lấy token từ cookie

//   // Danh sách các trang yêu cầu đăng nhập
//   const protectedRoutes = ["/dashboard", "/profile", "/settings"];

//   if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url)); // Chuyển hướng về login nếu chưa đăng nhập
//     }
//   }

//   return NextResponse.next(); // Tiếp tục render nếu đã đăng nhập
// }

// // Chỉ áp dụng middleware cho các route cụ thể
// export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"], // Các trang cần kiểm tra đăng nhập
// };


import { NextResponse } from "next/server";

export function middleware(req) {


  const token = req.cookies.get("authToken")?.value;
  const publicRoutes = ["/login", "/api/auth/login", "/api/auth/logout"];

  if (
    req.nextUrl.pathname.startsWith("/_next/") ||
    req.nextUrl.pathname.startsWith("/favicon.ico") ||
    req.nextUrl.pathname.startsWith("/static/")
  ) {
    return NextResponse.next();
  }
  // ✅ Nếu đã đăng nhập mà vào trang login, redirect về home
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/sanpham", req.url));
  }
  if (!token && !publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Áp dụng middleware cho tất cả route
export const config = {
  matcher: "/:path*", // Chặn tất cả route
};