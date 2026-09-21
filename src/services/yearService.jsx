import api from "./api";
import { ensureArray } from "../utils/ensureArray";

export const getAcademicYears = async () => {
  const response = await api.get("/academic-years");
  return ensureArray(response.data);
};

export const getCurrentYear = async () => {
  try {
    const response = await api.get("/academic-years/current");
    return response.data || null;
  } catch {
    return null;
  }
};