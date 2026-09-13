import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { ROLE_LABELS } from '../../features/auth/models/userModel.js';

export const ForbiddenPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const requiredRoles = location.state?.requiredRoles || [];

  return (
    <div className="forbidden-page py-8">
      <div className="container">
        <div className="error-state-card text-center max-w-xl mx-auto">
          <div className="error-icon-wrapper mx-auto mb-4">
            <ShieldAlert size={48} className="text-danger" />
          </div>

          <span className="badge badge-danger text-sm mb-2">Error 403 • Acceso Restringido</span>
          <h1 className="error-state-title mt-2">No tienes autorización para acceder a esta sección</h1>
          
          <p className="error-state-details mb-4">
            Tu cuenta actual está autenticada como{' '}
            <strong>{user ? `${user.name} (${ROLE_LABELS[user.role] || user.role})` : 'Invitado'}</strong>.
            Este módulo requiere permisos administrativos o credenciales específicas de operación.
          </p>

          {requiredRoles.length > 0 && (
            <div className="forbidden-roles-hint mb-4 p-3 bg-muted rounded">
              <small className="text-muted d-block mb-1">Roles con acceso autorizado:</small>
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                {requiredRoles.map((r) => (
                  <span key={r} className="badge badge-neutral text-xs">
                    {ROLE_LABELS[r] || r}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <Link to="/dashboard" className="btn btn-primary">
              <LayoutDashboard size={18} />
              <span>Ir a Mi Panel de Control</span>
            </Link>
            <Link to="/products" className="btn btn-outline-secondary">
              <ArrowLeft size={18} />
              <span>Volver al Catálogo</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
