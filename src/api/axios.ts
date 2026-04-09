import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/token";

// Khởi tạo hàng đợi để xử lý các request song song
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL_BACKEND}/api` || "http://localhost:3000/api",
  withCredentials: true,
});

/* ===== REQUEST INTERCEPTOR ===== */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===== RESPONSE INTERCEPTOR ===== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và không phải là request đang cố refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Nếu đang có một tiến trình refresh khác đang chạy, cho request này vào hàng đợi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          console.log("--- Đang gia hạn Token ---");
          
          // 1. Gọi Backend lấy cặp token mới
          const res = await api.post("/auth/refresh-token");
          const { accessToken, refreshToken: newRefreshToken } = res.data;

          // 2. Cập nhật Cookie nội bộ cho Next.js Middleware
          const responseNextjs = await fetch('/api/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: newRefreshToken }),
          });

          if (!responseNextjs.ok) throw new Error('Không thể đồng bộ Cookie Next.js');

          // 3. Lưu Access Token mới vào bộ nhớ
          setAccessToken(accessToken);
          
          // 4. Giải phóng hàng đợi (Cho phép các request đang đợi chạy tiếp)
          processQueue(null, accessToken);

          // 5. Thực hiện lại request gốc ban đầu
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          resolve(api(originalRequest));

        } catch (err) {
          // Nếu refresh thất bại hoàn toàn (Token DB hết hạn thật sự)
          processQueue(err, null);
          clearAccessToken();
          
          // Chuyển hướng về login nếu đang ở client
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          reject(err);
        } finally {
          isRefreshing = false;
        }
      });
    }

    return Promise.reject(error);
  }
);

export default api;