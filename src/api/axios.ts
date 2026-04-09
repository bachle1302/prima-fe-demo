import axios from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/token";
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL_BACKEND}/api` || "http://localhost:3000/api",
  withCredentials: true, // 🔥 gửi cookie refreshToken
});

/* ===== REQUEST ===== */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  console.log("Current access token:", token);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ===== RESPONSE ===== */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/refresh-token")) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh-token");
        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;
        const response = await fetch('/api/auth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: newRefreshToken }),
        });

        if (!response.ok) {
            throw new Error('Không thể set cookie xác thực');
        }
        console.log("Received new access token:", newAccessToken);
        setAccessToken(newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        clearAccessToken();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
