// yearService.js
import api from "./api";
export const getAcademicYears = async () => (await api.get("/academic-years")).data;
export const getCurrentYear   = async () => (await api.get("/academic-years/current")).data;
