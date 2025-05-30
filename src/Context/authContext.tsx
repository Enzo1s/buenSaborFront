import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Usuario } from '../interfaces/Usuario';
import { getByToken } from '../Api/UsuarioAPI';
import { Login } from '../interfaces/Login';
import { iniciarSesion, registrarUsuario } from '../Api/AuthAPI';


interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: Login) => Promise<void>;
  logout: () => void;
  register: (userData: Usuario) => Promise<void>;
}

// 3. Crea el contexto con un valor por defecto (será sobrescrito por el Provider)
// El 'as AuthContextType' es para TypeScript, ya que el valor inicial es null.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Interfaz para las props del AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const getUser = async (token: string) => {
        const usuario = await getByToken(token);
        setUser(usuario.data);
        setIsAuthenticated(true);
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        getUser(token);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false); 
  }, []);

  // Función para iniciar sesión
  const login = useCallback(async (userData: Login) => {
    try {
      const {data: token}  = await iniciarSesion(userData);
      const { data: user } = await getByToken(token);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('token', JSON.stringify(token));
    } catch (error) {
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  }, []);

  // Función para cerrar sesión
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); 
  }, []);

  const register = useCallback(async (userData: Usuario) => {
    const { data: token } = await registrarUsuario(userData);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', JSON.stringify(token)); 
  }, []);

  // El valor que se proporcionará a los consumidores del contexto
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// src/contexts/AuthContext.tsx (continuación)

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};