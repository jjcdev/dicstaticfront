
// eventService.js
import api from "./api";
export const getEvents    = async (params = {}) => (await api.get("/events", { params })).data;
export const getEventById = async (id) => (await api.get(`/events/${id}`)).data;

