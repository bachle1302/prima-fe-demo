"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Dùng useRouter để chuyển trang bằng code
import { register } from "@/auth/auth.service";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Khởi tạo router

  const handleLogin = async () => {
    try {
      // 1. Đợi register xong hoàn toàn
      await register(email, password);
      
      // 2. Chỉ chuyển trang sau khi register thành công
      router.push("/login"); 
      
    } catch (err) {
      alert("Registration failed");
    }
  };
 
  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleLogin}>Register</button>
    </div>
  );
}