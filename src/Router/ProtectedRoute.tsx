// src/routes/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../Context/authContext'
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  // Puedes añadir roles requeridos, etc.
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  // Opcional: Si requieres roles específicos
  if (allowedRoles && user && user.rol) {
    const hasRequiredRole = allowedRoles.some(role => user.rol?.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />; // O a una página de "acceso denegado"
    }
  }

  // Si está autenticado (y tiene los roles, si se especificaron), renderiza los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;