// authService.js
import api from "./api";
export const login  = async (email, password) => (await api.post("/auth/login", { email, password })).data;
export const getMe  = async () => (await api.get("/auth/me")).data;

