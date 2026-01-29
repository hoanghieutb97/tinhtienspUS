"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (!token) {
      router.push("/login"); // Nếu chưa đăng nhập, chuyển hướng về login
    }
  }, []);

  return <h1>Chào mừng bạn đến Dashboard</h1>;
}
