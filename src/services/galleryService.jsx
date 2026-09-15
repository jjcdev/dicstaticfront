
// galleryService.js
import api from "./api";
export const getGalleryPosts = async (params = {}) => (await api.get("/gallery", { params })).data;
