import { resolveStaticBase } from "../services/api";

const STATIC_URL = resolveStaticBase();

export function resolveImage(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${STATIC_URL}${url}`;
  return `${STATIC_URL}/${url}`;
}