import { createContext, useEffect, useMemo, useState } from "react";
import apiClient, { setAuthToken } from "../services/apiClient";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setAuthToken(token);
        const response = await apiClient.get("/auth/me");
        setUser(response.data.user);
      } catch (error) {
        console.error("Auth load failed", error);
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  useEffect(() => {
    const handleLogoutEvent = () => {
      setAuthToken(null);
      setToken(null);
      setUser(null);
    };

    window.addEventListener("logout", handleLogoutEvent);
    return () => window.removeEventListener("logout", handleLogoutEvent);
  }, []);

  const login = (authToken, userData) => {
    setAuthToken(authToken);
    setToken(authToken);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userLoggedIn", "true");
  };

  const updateUser = (updatedFields) => {
    setUser((current) => ({ ...current, ...updatedFields }));
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userLoggedIn");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "Admin",
      login,
      updateUser,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
export default AuthContext;
