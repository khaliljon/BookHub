import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRoles } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (role: UserRoles) => boolean;
  hasAnyRole: (roles: UserRoles[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Восстанавливаем данные пользователя из localStorage при загрузке
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error('Ошибка при парсинге данных пользователя:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User, authToken: string) => {
    console.log('🔐 Login called with userData:', userData);
    console.log('🔐 User roles:', userData.roles);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const hasRole = (role: UserRoles): boolean => {
    console.log('🔍 hasRole check:', role, 'user:', user, 'user.roles:', user?.roles);
    if (!user || !user.roles) return false;
    const result = user.roles.some(userRole => {
      // Проверяем и объектную структуру и массив строк
      const roleName = typeof userRole === 'string' ? userRole : userRole.name;
      console.log('🔍 Comparing roleName:', roleName, 'with role:', role);
      return roleName === role;
    });
    console.log('🔍 hasRole result:', result);
    return result;
  };

  const hasAnyRole = (roles: UserRoles[]): boolean => {
    console.log('🔍 hasAnyRole check:', roles, 'user:', user, 'user.roles:', user?.roles);
    if (!user || !user.roles) return false;
    const result = user.roles.some(userRole => {
      // Проверяем и объектную структуру и массив строк
      const roleName = typeof userRole === 'string' ? userRole : userRole.name;
      console.log('🔍 Checking if roles includes:', roleName);
      return roles.includes(roleName as UserRoles);
    });
    console.log('🔍 hasAnyRole result:', result);
    return result;
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
