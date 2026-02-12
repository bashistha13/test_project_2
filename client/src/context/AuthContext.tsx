import { createContext, useContext, useState, useEffect,} from 'react';
import type { ReactNode } from 'react';
// FIX IMPORT: explicit path to ensure it finds the file
import type { User } from '../features/auth/types/index'; 

// 1. FIX INTERFACE: Explicitly say login takes 3 arguments
interface AuthContextType {
  user: User | null;
  token: string | null;
  // This line below fixes the "Expected 2 arguments" error
  login: (token: string, username: string, role: string) => void; 
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from storage", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // 2. IMPLEMENTATION: Matches the interface (3 arguments)
  const login = (newToken: string, username: string, role: string) => {
    const newUser = { username, role };
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};