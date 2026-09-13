import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import LoadingState from '../feedback/LoadingState.jsx';

export const RoleRoute = ({ children, allowedRoles = [], requiredPermission }) => {
  const { user, isAuthenticated, isLoading, checkPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="container py-8">
        <LoadingState type="spinner" message="Verificando permisos y nivel de acceso..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar por rol
  const hasRole = allowedRoles.length === 0 || allowedRoles.includes(user.role);

  // Verificar por permiso
  const hasPerm = !requiredPermission || checkPermission(requiredPermission);

  if (!hasRole || !hasPerm) {
    return <Navigate to="/403" state={{ requiredRoles: allowedRoles, requiredPermission }} replace />;
  }

  return children;
};

export default RoleRoute;
