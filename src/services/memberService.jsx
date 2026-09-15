
// memberService.js
import api from "./api";
export const getMembers = async (yearId) =>
  (await api.get("/members", { params: yearId ? { yearId } : {} })).data;
