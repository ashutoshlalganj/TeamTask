import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("taskManagerUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("taskManagerToken"),
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  const saveSession = (userData) => {
    localStorage.setItem("taskManagerUser", JSON.stringify(userData));
    localStorage.setItem("taskManagerToken", userData.token);
    setUser(userData);
    setToken(userData.token);
  };

  const clearSession = () => {
    localStorage.removeItem("taskManagerUser");
    localStorage.removeItem("taskManagerToken");
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common.Authorization;
  };

  const login = async (credentials) => {
    setLoading(true);
    const data = await loginUser(credentials);
    saveSession(data);
    setLoading(false);
    return data;
  };

  const register = async (payload) => {
    setLoading(true);
    const data = await registerUser(payload);
    saveSession(data);
    setLoading(false);
    return data;
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout: clearSession }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
