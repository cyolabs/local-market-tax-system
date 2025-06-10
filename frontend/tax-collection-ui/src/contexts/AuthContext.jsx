import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing auth state
    const token = localStorage.getItem('access');
    if (token) {
      axios.get('/auth/user/')
        .then(res => setCurrentUser(res.data))
        .catch(() => localStorage.removeItem('access'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await axios.post('/login/', credentials);
    localStorage.setItem('access', res.data.access);
    setCurrentUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('access');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}