import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_MESSAGING_URL || "http://localhost:3000";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Set axios default header
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Fetch user data
          const response = await axios.get(`${API_URL}/api/users/me`);
          setUser(response.data.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (mobile) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, {
        mobile,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const verifyOTP = async (userId, otp) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/verify-otp`, {
        userId,
        otp,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "OTP failed";
    }
  };

  const register = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, data);

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const passwordLogin = async (mobile, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/users/password-login`, {
        mobile,
        password,
      });

      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);

      setToken(newToken);
      setUser(userData);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const forgotPassword = async (mobile, password) => {
    try {
      const response = await axios.put(`${API_URL}/api/users/forgot-password`, {
        mobile,
        password,
      });

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Password update failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    loading,
    login,
    verifyOTP,
    register,
    passwordLogin,
    forgotPassword,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
