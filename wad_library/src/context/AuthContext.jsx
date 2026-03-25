import { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('library_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('library_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const found = usersData.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const userData = { id: found.id, email: found.email, name: found.name, role: found.role };
      setUser(userData);
      localStorage.setItem('library_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
