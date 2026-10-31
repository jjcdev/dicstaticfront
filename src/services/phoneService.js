import api from "./api";
import { ensureArray } from "../utils/ensureArray";

/**
 * Liste des prefixes telephoniques supportes.
 * Chaque entree : { value, label, placeholder }
 * Le frontend se sert du placeholder comme aide visuelle uniquement.
 */
export const getPhonePrefixes = async () => {
  const response = await api.get("/phone-prefixes");
  return ensureArray(response.data);
};