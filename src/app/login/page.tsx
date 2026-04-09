"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Dùng useRouter để chuyển trang bằng code
import { getMe, login } from "@/auth/auth.service";
import { useAuth } from "@/auth/AuthContext";
import axios from "@/api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Khởi tạo router

  const handleLogin = async () => {
    try {
      // 1. Đợi login xong hoàn toàn (đã lưu token vào storage/cookie)
      const res = await login(email, password);
      console.log("Login successful, user info:", res);
      // 2. Chỉ chuyển trang sau khi login thành công
      const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: res.refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Không thể set cookie xác thực');
        }

        console.log('--- Set Cookie thành công ---');

        // 3. Chuyển trang (Nên dùng window.location để Middleware nhận cookie ngay lập tức)
        window.location.href = '/profile';
      router.push("/profile"); 
      
    } catch (err) {
      alert("Login failed");
    } 
  };
 
  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Button bình thường, không bọc Link */}
      <button onClick={handleLogin}>Login</button>
      <p>bạn chưa có tài khoản? <a href="/register">Đăng ký</a></p>
    </div>
  );
}