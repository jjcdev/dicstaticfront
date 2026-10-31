import api from "./api";
import { ensureArray } from "../utils/ensureArray";

/**
 * Soumet une candidature. Leve une erreur axios si le backend refuse
 * (400 validation, 409 doublon, 429 rate-limit).
 */
export const submitApplication = async (payload) => {
  const response = await api.post("/applications", payload);
  return response.data;
};

/**
 * Listing admin. Parametres supportes :
 *  { pole, email, yearId, from, to, limit, offset }
 */
export const getApplications = async (params = {}) => {
  const response = await api.get("/applications", { params });
  return ensureArray(response.data);
};

export const getApplicationById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data || null;
};

export const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};