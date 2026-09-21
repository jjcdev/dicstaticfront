import { createContext, useEffect, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dic_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .getMe()
      .then((data) => setAdmin(data.admin))
      .catch(() => {
        localStorage.removeItem("dic_token");
        setAdmin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem("dic_token", data.token);
    setAdmin(data.admin);
    return data;
  };

  const signOut = () => {
    localStorage.removeItem("dic_token");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}