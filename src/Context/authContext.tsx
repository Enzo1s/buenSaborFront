import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Usuario } from "../interfaces/Usuario";
import { getByToken } from "../Api/UsuarioAPI";
import { Login } from "../interfaces/Login";
import { iniciarSesion, registrarUsuario } from "../Api/AuthAPI";
import { useNavigate } from "react-router";
import { Empleado } from "../interfaces/Empleado";
import { getByUsuarioId } from "../Api/EmpleadoAPI";
import { Cliente } from "../interfaces/Cliente";
import { getClienteByIdUsuario } from "../Api/ClienteAPI";
import { Rol } from "../enums/Rol";

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
  const [empleado, setEmpleado] = useState<Empleado | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchUserAndRoleData = async (token: string) => {
    try {
      const usuarioRes = await getByToken(token);
      const usuario = usuarioRes.data;
      setUser(usuario);
      setIsAuthenticated(true);

      if (usuario.rol === Rol.CLIENTE) {
        const { data: clienteData } = await getClienteByIdUsuario(usuario.id);
        setCliente(clienteData);
        setEmpleado(null);
        console.log("Cliente cargado:", clienteData);
      } else if (usuario.rol === Rol.EMPLEADO || usuario.rol === Rol.ADMIN) {
        const { data: empleadoData } = await getByUsuarioId(usuario.id);
        setEmpleado(empleadoData);
        setCliente(null);
        console.log("Empleado cargado:", empleadoData);
      }
    } catch (error) {
      console.error("Error al cargar usuario y rol:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token")?.replace(/"/g, "");

    const fetchUser = async () => {
      try {
        if (token) {
          const { data: usuario } = await getByToken(token);
          setUser(usuario);
          setIsAuthenticated(true);
          console.log("Usuario cargado:", usuario);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRolEspecifico = async () => {
      if (!user || !user.id) return;

      try {
        if (user.rol?.toString() === "CLIENTE") {
          const { data } = await getClienteByIdUsuario(user.id);
          console.log("Cliente cargado:", data);
          setCliente(data);
        } else if (user.rol?.toString() === "EMPLEADO" || user.rol?.toString() === "ADMIN") {
          const { data } = await getByUsuarioId(user.id);
          console.log("Empleado cargado:", data);
          setEmpleado(data);
        }
      } catch (error) {
        console.error("Error al obtener cliente/empleado:", error);
      }
    };

    fetchRolEspecifico();
  }, [user]); // ⬅️ Solo se ejecuta cuando `user` ya está seteado

  const login = useCallback(async (userData: Login) => {
    try {
      const { data: token } = await iniciarSesion(userData);
      localStorage.setItem("token", JSON.stringify(token));
      await fetchUserAndRoleData(token.replace(/"/g, ""));
      navigate("/");
    } catch (error) {
      alert("Error al iniciar sesión. Verificá tus credenciales.");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setEmpleado(null);
    setCliente(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  }, []);

  const register = useCallback(
    async (userData: Usuario): Promise<Usuario | null> => {
      try {
        const { data: token } = await registrarUsuario(userData);
        localStorage.setItem("token", JSON.stringify(token));
        const cleanToken = token.replace(/"/g, "");

        const usuarioRes = await getByToken(cleanToken);
        const usuario = usuarioRes.data;
        setUser(usuario);
        setIsAuthenticated(true);

        if (usuario.rol === Rol.CLIENTE) {
          const { data: clienteData } = await getClienteByIdUsuario(usuario.id);
          setCliente(clienteData);
          setEmpleado(null);
        } else if (usuario.rol === Rol.EMPLEADO || usuario.rol === Rol.ADMIN) {
          const { data: empleadoData } = await getByUsuarioId(usuario.id);
          setEmpleado(empleadoData);
          setCliente(null);
        }

        return usuario; // ✅ Devolvés el usuario creado
      } catch (error) {
        alert("Error al registrarse.");
        return null;
      }
    },
    []
  );
  

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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
