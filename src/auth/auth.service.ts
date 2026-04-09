import api from "../api/axios";
import { setAccessToken, clearAccessToken, getAccessToken } from "./token";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });

  setAccessToken(res.data.accessToken);
  console.log("get accesstoken: "+getAccessToken());
  return res.data;
};
export const register = async (email: string, password: string) => {
  const res = await api.post("/auth/register", { email, password });
  return res.data;
}

export const getMe = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
  await fetch('/api/auth/logout', { method: 'POST' });
  clearAccessToken();
};

export const logoutAll = async () => {
  await api.post("/auth/logoutAll");
  await fetch('/api/auth/logout', { method: 'POST' });
  clearAccessToken();
};