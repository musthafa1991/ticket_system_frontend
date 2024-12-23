import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllTickets, getUserTickets } from "../services/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    user: null,
    roleData: null, // Store role-based data
  });
  const [loading, setLoading] = useState(true);

  const fetchRoleData = async (user) => {
    try {
      let roleData = null;
      if (user.role === "admin") {
        // Fetch admin-specific data
        const response = await getAllTickets();
        roleData = response.data;
      } else if (user.role === "user") {
        // Fetch user-specific data
        const response = await getUserTickets(user.id);
        roleData = response.data;
      }
      setAuth((prev) => ({ ...prev, roleData }));
    } catch (err) {
      console.error("Error fetching role data:", err);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("userInfo");

      if (token && userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setAuth({ token, user, roleData: null });
          await fetchRoleData(user);
        } catch (error) {
          console.error("Error parsing userInfo:", error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setAuth({ token: null, user: null, roleData: null });
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, logout, loading, fetchRoleData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
