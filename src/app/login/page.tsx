"use client";
import { useState } from "react";
import { login } from "@/auth/auth.service";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // 1. Gọi Backend lấy Token
      await login(email, password);
      
      // 2. Gửi sang Next.js Server để set Cookie "chính chủ"
 

      // 3. ĐIỀU HƯỚNG QUAN TRỌNG:
      // Dùng window.location.replace để ép trình duyệt tải lại từ Server
      // và XÓA trang login khỏi lịch sử (nhấn Back sẽ không quay lại login nữa)
      window.location.replace('/profile');

    } catch (err) {
      console.error(err);
      alert("Đăng nhập thất bại, vui lòng kiểm tra lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Login"}
      </button>
      <p>Bạn chưa có tài khoản? <a href="/register">Đăng ký</a></p>
    </div>
  );
}