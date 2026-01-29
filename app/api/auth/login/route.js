import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, passWord } = body;

    if (!email || !passWord) {
      return NextResponse.json({ message: "Email và mật khẩu là bắt buộc!" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "Email không tồn tại!" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(passWord, user.passWord);
    if (!isMatch) {
      return NextResponse.json({ message: "Mật khẩu không đúng!" }, { status: 401 });
    }

    // Tạo JWT
    const token = jwt.sign(
      { email: user.email, role: user.role, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "100h" }
    );

    console.log("Tạo token:", token);

    // ✅ Ép secure = false khi chạy HTTP + IP local
    const isSecure = req.headers.get("x-forwarded-proto") === "https";
    console.log("isSecure:", isSecure);

    // Ghi cookie
    const cookieStore = cookies();
    cookieStore.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: false, //  TẮT SECURE nếu dùng HTTP
      sameSite: "lax",
      path: "/",
      maxAge: 100 * 60 * 60, // 100h
    });

    return NextResponse.json({ message: "Đăng nhập thành công!", status: user.status }, { status: 200 });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json({ message: "Đăng nhập thất bại, thử lại sau!" }, { status: 500 });
  }
}
