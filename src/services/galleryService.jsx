import api from "./api";
import { ensureArray } from "../utils/ensureArray";

export const getGalleryPosts = async (params = {}) => {
  const response = await api.get("/gallery", { params });
  return ensureArray(response.data);
};