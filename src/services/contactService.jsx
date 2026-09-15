// contactService.js
import api from "./api";
export const sendMessage = async (payload) => (await api.post("/contact", payload)).data;