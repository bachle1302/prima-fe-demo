import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/token";

// Khởi tạo hàng đợi để xử lý các request song song (Race Condition)
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
  withCredentials: true, // Quan trọng để gửi kèm Refresh Token trong Cookie
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

    // Nếu lỗi 401 (Unauthorized) và chưa từng thử lại (retry)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Trường hợp 1: Đang có một request khác đang thực hiện Refresh
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

      // Trường hợp 2: Bắt đầu tiến trình Refresh đầu tiên
      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(async (resolve, reject) => {
        try {
          console.log("--- Đang gia hạn Access Token ---");
          
          // 1. Gọi Backend lấy Access Token mới
          // Vì Backend dùng Cookie (HttpOnly) nên không cần truyền body
          const res = await api.post("/auth/refresh-token");
          const { accessToken } = res.data;

          // 2. Lưu Access Token mới vào bộ nhớ (Memory/Zustand/Redux)
          setAccessToken(accessToken);
          
          // 3. Giải phóng hàng đợi cho các request đang chờ
          processQueue(null, accessToken);

          // 4. Thực hiện lại request gốc với token mới
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          resolve(api(originalRequest));

        } catch (err) {
          // Nếu refresh thất bại (Refresh Token hết hạn hoặc bị xóa trong DB)
          processQueue(err, null);
          clearAccessToken();
          
          // Xóa thông tin đăng nhập và đẩy về trang login
          if (typeof window !== "undefined") {
            // Bạn có thể gọi thêm API logout ở đây nếu cần xóa cookie thủ công
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