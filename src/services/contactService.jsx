import api from "./api";
import { ensureArray } from "../utils/ensureArray";

export const sendMessage = async (payload) => {
  const response = await api.post("/contact", payload);
  return response.data;
};

export const getMessages = async () => {
  const response = await api.get("/contact");
  return ensureArray(response.data);
};