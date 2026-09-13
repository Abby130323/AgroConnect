import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, ShieldCheck, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import authService from '../../features/auth/services/authService.js';
import { ROLE_LABELS, USER_ROLES } from '../../features/auth/models/userModel.js';
import LoadingState from '../../components/feedback/LoadingState.jsx';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Error al cargar usuarios', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user) => {
    try {
      const updated = await authService.updateUser(user.id, {
        ...user,
        active: !user.active,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, active: updated.active } : u))
      );
      toast.success(
        `Usuario ${updated.name} ${updated.active ? 'activado' : 'desactivado'} exitosamente`
      );
    } catch (err) {
      toast.error('Error al actualizar estado del usuario', { description: err.message });
    }
  };

  return (
    <div className="admin-users-page py-6">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge badge-primary text-xs">Administración Central</span>
              <span className="badge badge-neutral text-xs">Endpoint: /usuario</span>
            </div>
            <h1 className="page-title">Gestión de Usuarios y Roles</h1>
            <p className="page-subtitle">
              Administra los 10 perfiles de demostración académica y su nivel de autorización RBAC.
            </p>
          </div>

          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={fetchUsers}>
            <RefreshCw size={14} className="mr-1" />
            <span>Refrescar MockAPI</span>
          </button>
        </div>

        {loading ? (
          <LoadingState type="spinner" message="Consultando usuarios en MockAPI..." />
        ) : (
          <div className="admin-table-card">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Rol Asignado</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="avatar-sm rounded-full" />
                        <div>
                          <strong>{u.name}</strong>
                          <small className="d-block text-muted">{u.title || 'Usuario registrado'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="d-flex align-items-center gap-1 text-sm">
                        <Mail size={14} className="text-muted" />
                        <span>{u.email}</span>
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-neutral text-xs">
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td>
                      {u.active ? (
                        <span className="badge badge-success text-xs d-inline-flex align-items-center gap-1">
                          <UserCheck size={12} />
                          <span>Activo</span>
                        </span>
                      ) : (
                        <span className="badge badge-danger text-xs d-inline-flex align-items-center gap-1">
                          <UserX size={12} />
                          <span>Inactivo</span>
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${u.active ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                        onClick={() => handleToggleActive(u)}
                        disabled={u.role === USER_ROLES.ADMIN}
                      >
                        {u.active ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
