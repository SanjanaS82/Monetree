import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
}

interface AuthActions {
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  deleteProfile: () => void;
}

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const USERS_KEY = "monetree_users";
const SESSION_KEY = "monetree_session";

interface StoredUser {
  username: string;
  password: string;
}

const getUsers = (): StoredUser[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      setIsLoggedIn(true);
      setUsername(session);
    }
  }, []);

  const login = useCallback((uname: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find((u) => u.username === uname && u.password === password);
    if (!user) return false;
    sessionStorage.setItem(SESSION_KEY, uname);
    setIsLoggedIn(true);
    setUsername(uname);
    return true;
  }, []);

  const signup = useCallback((uname: string, password: string): boolean => {
    const users = getUsers();
    if (users.find((u) => u.username === uname)) return false;
    users.push({ username: uname, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    sessionStorage.setItem(SESSION_KEY, uname);
    setIsLoggedIn(true);
    setUsername(uname);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setUsername(null);
  }, []);

  const deleteProfile = useCallback(() => {
    const users = getUsers().filter((u) => u.username !== username);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    // Also clear reminder settings for this user
    if (username) {
      localStorage.removeItem(`monetree_reminder_${username}`);
    }
    logout();
  }, [username, logout]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, signup, logout, deleteProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
