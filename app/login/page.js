"use client";
import { useState } from "react";
import AllLoading from "../allLoading";
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel } from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [passWord, setpassWord] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true)
    e.preventDefault();

    console.log("Gửi request đến /api/auth/login:", { email, passWord });

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, passWord }),
    });

    const data = await res.json();
    console.log("Phản hồi từ server:", data);

    if (res.ok) {
      setMessage("Đăng nhập thành công!");
      localStorage.setItem("userStatus", data.status);
      window.location.href = "/sanpham";

    } else {
      setMessage(data.message || "Đăng nhập thất bại");
    }
    setLoading(false)
  };
  if (loading) {
    return <AllLoading />;
  }
  return (
    <>


      <Container maxWidth="xs">
        <Box
          sx={{
            mt: 10,
            p: 4,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          {/* <Typography variant="h5" fontWeight="bold">Đăng nhập</Typography> */}

          <Typography color="textSecondary" sx={{ mb: 2 }}>Liên hệ Admin để cấp tài khoản mới ! </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Mật Khẩu"
              type="password"
              fullWidth
              margin="normal"
              required
              onChange={(e) => setpassWord(e.target.value)}
            />

            {/* <FormControlLabel control={<Checkbox />} label="Remember me" /> */}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#1976d2" }}>
              Đăng nhập
            </Button>
          </form>
        </Box>
        {message && <p className="mt-4 text-red-600">{message}</p>}
      </Container>


    </>
  );
}
