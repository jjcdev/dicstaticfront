import api from "./api";
import { ensureArray } from "../utils/ensureArray";

export const getEvents = async (params = {}) => {
  const response = await api.get("/events", { params });
  return ensureArray(response.data);
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data || null;
};