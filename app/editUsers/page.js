"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button, Container, Box, Typography, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
export default function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [passWord, setpassWord] = useState(generatepassWord);
  const [users, setUsers] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/user/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, passWord, status }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Tạo user thành công!");
      setName("");
      setEmail("");
    } else {
      console.log(data);

      setMessage(data.message || "Lỗi khi tạo user.");
    }


    const res2 = await fetch("/api/user/getAll", {
      method: "GET",
      credentials: "include", // ✅ gửi kèm cookie để xác thực
    });
    const dat2a = await res2.json();
    setUsers(dat2a);

  };

  // Lấy danh sách user từ API
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/user/getAll", {
        method: "GET",
        credentials: "include", // ✅ gửi kèm cookie để xác thực
      });
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);
  console.log(users);
  function generatepassWord(length = 12) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let passWord = "";
    for (let i = 0; i < length; i++) {
      passWord += charset[Math.floor(Math.random() * charset.length)];
    }
    return passWord;
  }


  const statusOptions = ["admin", "pro", "kho", "taosp"];
  const handleStatusChange = (value, key) => {

    setUsers((prevUsers) =>
      prevUsers.map((user, keymap) => (keymap === key ? { ...user, status: value } : user))
    );
  };
  async function deleteUser(item) {
    console.log(item);
    try {

      const response = await fetch(`/api/user/update?id=${item._id}`, {
        method: 'DELETE',
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {

      } else {
        console.error("Lỗi khi xóa:", result.error);
      }

    } catch (error) {
      console.error("Lỗi hệ thống:", error);
    }
    finally {
      
      const res = await fetch("/api/user/getAll", {
        method: "GET",
        credentials: "include", // ✅ gửi kèm cookie để xác thực
      });
      const data = await res.json();
      setUsers(data);

    }

  }
  async function handleChangeItem(item) {
    let { _id, ...updateFields } = item;
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: _id, updateData: updateFields }),
    });

    const res2 = await fetch("/api/user/getAll", {
      method: "GET",
      credentials: "include", // ✅ gửi kèm cookie để xác thực
    });
    const data = await res2.json();
    setUsers(data);
  }

  return (
    <div className="container">
      <div className="row">

        <div className="col-4">

          <Container maxWidth="xs">
            <Box sx={{ mt: 5, p: 4, bgcolor: "white", borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold">Tạo User</Typography>

              <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                <TextField
                  label="Tên"
                  fullWidth
                  margin="normal"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  label="Mật khẩu"
                  fullWidth
                  margin="normal"
                  required
                  value={passWord}
                  onChange={(e) => setpassWord(e.target.value)}
                />
                <TextField
                  select
                  label="Chọn trạng thái"
                  fullWidth
                  margin="normal"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="pro">Pro</MenuItem>
                  <MenuItem value="kho">Kho</MenuItem>
                  <MenuItem value="taosp">Tạo SP</MenuItem>
                </TextField>

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                  Tạo User
                </Button>
              </form>

              {message && <Typography color="green" sx={{ mt: 2 }}>{message}</Typography>}
            </Box>
          </Container>


          {/* <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Tạo User</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <input
                type="text"
                placeholder="pass"
                value={passWord == undefined ? generatepassWord() : passWord}
                onChange={(e) => setpassWord(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />

              <select
                className="w-full p-2 border rounded mb-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Chọn trạng thái</option>
                <option value="admin">admin</option>
                <option value="pro">pro</option>
                <option value="kho">kho</option>
                <option value="taosp">tạo SP</option>

              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tạo User
              </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
          </div> */}
        </div>

        <div className="col-8">
          <TableContainer component={Paper} sx={{ width: "100%", margin: "auto", mt: 4, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Tên</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>

                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>Trạng thái</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>sửa</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((item, key) => (
                  <TableRow key={key} hover>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>

                    <TableCell>
                      <Select
                        value={item.status}
                        onChange={(e) => handleStatusChange(e.target.value, key)}
                        fullWidth
                        sx={{ minWidth: 120 }}
                      >
                        {statusOptions.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="success" className=' w-100 dvsdv' onClick={() => handleChangeItem(item)}>
                        Sửa
                      </Button>
                    </TableCell>
                    <TableCell> <DeleteIcon onClick={() => deleteUser(item)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

    </div>

  );
}
