import api from "./api";
import { ensureArray } from "../utils/ensureArray";

export const getMembers = async (yearId) => {
  const response = await api.get("/members", {
    params: yearId ? { yearId } : {},
  });
  return ensureArray(response.data);
};