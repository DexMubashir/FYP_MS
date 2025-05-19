import React, { createContext, useState, useEffect } from "react";
import { loginUser, fetchUserProfile } from "../services/auth";
export const AuthContext = createContext();

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh") || null
  );
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password); // ✅ Only one request
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      await fetchUser(data.access);
    } catch (err) {
      throw err; // rethrow to display error in Login.jsx
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
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
