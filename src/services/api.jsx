import axios from "axios";

/* ============================================================
   Resolution dynamique des URLs
   - En dev local       : http://localhost:5000
   - En test reseau     : http://192.168.x.x:5000
   - En production      : VITE_API_URL / VITE_STATIC_URL si definis
   ============================================================ */

export function resolveApiBase() {
  const explicit = import.meta.env.VITE_API_URL;
  if (explicit) return explicit;

  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}//${host}:5000/api`;
}

export function resolveStaticBase() {
  const explicit = import.meta.env.VITE_STATIC_URL;
  if (explicit) return explicit;

  const host = window.location.hostname;
  const protocol = window.location.protocol;
  return `${protocol}//${host}:5000`;
}

/* ============================================================
   Instance Axios
   ============================================================ */

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