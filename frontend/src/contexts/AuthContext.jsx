import React, { createContext, useState, useEffect } from "react";
import { loginUser, fetchUserProfile } from "../services/auth";
export const AuthContext = createContext();

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access") || sessionStorage.getItem("access") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh") || sessionStorage.getItem("refresh") || null
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email, password, rememberMe = true) => {
    try {
      const data = await loginUser(email, password);
      if (rememberMe) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("refresh");
      } else {
        sessionStorage.setItem("access", data.access);
        sessionStorage.setItem("refresh", data.refresh);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      await fetchUser(data.access);
    } catch (err) {
      throw err;
    }
  };

  const fetchUser = async (token) => {
    try {
      const userData = await fetchUserProfile(token);
      setUser(userData);
    } catch (err) {
      logout(); // If token fails or expires
    }
  };
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    if (accessToken) {
      fetchUser(accessToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
