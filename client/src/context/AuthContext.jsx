import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await authService.getMe();
      if (data && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    if (data && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password);
    if (data && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
