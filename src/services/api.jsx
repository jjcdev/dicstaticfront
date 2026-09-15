import axios from "axios";

/**
 * Construit l'URL de base de l'API a partir du hostname courant.
 * - En dev local (localhost) : http://localhost:5000/api
 * - En test reseau (192.168.x.x) : http://192.168.x.x:5000/api
 * - En prod : VITE_API_URL si defini, sinon deduction.
 */
function resolveApiBase() {
  const explicit = import.meta.env.VITE_API_URL;
  if (explicit && !explicit.includes("localhost")) return explicit;

  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}//${host}:5000/api`;
}

export function resolveStaticBase() {
  const explicit = import.meta.env.VITE_STATIC_URL;
  if (explicit && !explicit.includes("localhost")) return explicit;

  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}//${host}:5000`;
}

const api = axios.create({ baseURL: resolveApiBase() });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dic_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("dic_token");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;