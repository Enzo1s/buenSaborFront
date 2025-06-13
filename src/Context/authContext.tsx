import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Usuario } from '../interfaces/Usuario';
import { getByToken } from '../Api/UsuarioAPI';
import { Login } from '../interfaces/Login';
import { iniciarSesion, registrarUsuario } from '../Api/AuthAPI';
import { useNavigate } from 'react-router';


interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: Login) => Promise<void>;
  logout: () => void;
  register: (userData: Usuario) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate()

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
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false); 
  }, []);

  const login = useCallback(async (userData: Login) => {
    try {
      const {data: token}  = await iniciarSesion(userData);
      const { data } = await getByToken(token.replace('\"',''));
      setUser(data);
      setIsAuthenticated(true);
      localStorage.setItem('token', JSON.stringify(token));
      console.log(data.rol);
      navigate('/')
    } catch (error) {
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); 
  }, []);

  const register = useCallback(async (userData: Usuario) => {
    try {
      const { data: token } = await registrarUsuario(userData);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', JSON.stringify(token));

    } catch (error) {
      if (error instanceof Error) {
  alert((error as any).response?.data?.error || error?.message );
} else {
    console.error('Unknown error:', error);
  }
    }
  }, []);

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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};