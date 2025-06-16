import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Usuario } from '../interfaces/Usuario';
import { getByToken } from '../Api/UsuarioAPI';
import { Login } from '../interfaces/Login';
import { iniciarSesion, registrarUsuario } from '../Api/AuthAPI';
import { useNavigate } from 'react-router';
import { Empleado } from '../interfaces/Empleado';
import { getByUsuarioId } from '../Api/EmpleadoAPI';
import { Cliente } from '../interfaces/Cliente';
import { getClienteByIdUsuario } from '../Api/ClienteAPI';
import { Rol } from '../enums/Rol';


interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  empleado: Empleado | null;
  cliente: Cliente | null;
  setCliente: React.Dispatch<React.SetStateAction<Cliente | null>>;
  setEmpleado: React.Dispatch<React.SetStateAction<Empleado | null>>;
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
  const [empleado, setEmpleado] = useState<Empleado | null>(null)
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate()

  const getUser = async (token: string) => {
        const usuario = await getByToken(token);
        setUser(usuario.data);
        setIsAuthenticated(true);
  }

  const getEmpleado = async () => {
    if(user && user.id && user.rol === Rol.EMPLEADO) {
      try {
        const {data} = await getByUsuarioId(user?.id);
        setEmpleado(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const getCliente = async () => {
    if(user && user.id && user.rol === Rol.CLIENTE) {
      try {
        const {data} = await getClienteByIdUsuario(user?.id);
        setCliente(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        getUser(token);
        getEmpleado();
        getCliente();
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
    empleado,
    cliente,
    setCliente,
    setEmpleado,
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