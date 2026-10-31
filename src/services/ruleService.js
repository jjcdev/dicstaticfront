import api from "./api";
import { ensureArray } from "../utils/ensureArray";

// --- Public ---
export const getPublicRules = async () => {
  const response = await api.get("/rules");
  return ensureArray(response.data);
};

// --- Admin ---
export const getAdminRules = async () => {
  const response = await api.get("/rules/admin");
  return ensureArray(response.data);
};

export const getRuleById = async (id) => {
  const response = await api.get(`/rules/${id}`);
  return response.data || null;
};

export const createRule = async (payload) => {
  const response = await api.post("/rules", payload);
  return response.data;
};

export const updateRule = async (id, payload) => {
  const response = await api.put(`/rules/${id}`, payload);
  return response.data;
};

export const deleteRule = async (id) => {
  const response = await api.delete(`/rules/${id}`);
  return response.data;
};

export const reorderRules = async (order) => {
  const response = await api.post("/rules/reorder", { order });
  return ensureArray(response.data);
};