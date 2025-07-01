import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('user_role');
    if (token && username) {
      setCurrentUser({ username, role });
    }

    setLoading(false); // Auth check is done
  }, []);

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const login = (tokenData) => {
  localStorage.setItem('access_token', tokenData.access);
  localStorage.setItem('username', tokenData.username);
  localStorage.setItem('user_role', tokenData.role); // Add this
  setCurrentUser({ 
    username: tokenData.username,
    role: tokenData.role
  });
};
  return (
    <AuthContext.Provider value={{ currentUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
