import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { loginSchema } from '../models/authValidation.js';
import { useAuth } from '../hooks/useAuth.js';
import { INITIAL_USERS, ROLE_LABELS } from '../models/userModel.js';

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@agroconnect.com',
      password: 'Admin123',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`¡Bienvenido de vuelta, ${user.name}!`, {
        description: `Sesión iniciada con rol: ${ROLE_LABELS[user.role] || user.role}`,
      });
      navigate(from, { replace: true });
    } catch (err) {
      toast.error('Error de autenticación', {
        description: err.message || 'No fue posible iniciar sesión.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (user) => {
    setValue('email', user.email);
    setValue('password', user.password);
    toast.info(`Credenciales seleccionadas: ${user.name}`, {
      description: `Rol: ${ROLE_LABELS[user.role]} (${user.email})`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="auth-card"
    >
      <div className="auth-card-header">
        <div className="auth-brand-badge">
          <ShieldCheck size={20} className="text-primary" />
          <span>Acceso al Sistema AgroConnect</span>
        </div>
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">
          Ingresa con tu cuenta asignada o selecciona uno de los perfiles de demostración académica.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form" noValidate>
        {/* Campo Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Correo Electrónico
          </label>
          <div className="input-icon-wrapper">
            <Mail size={18} className="input-left-icon" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`form-control input-with-icon ${errors.email ? 'is-invalid' : ''}`}
              placeholder="admin@agroconnect.com"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span className="form-error-msg" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Campo Contraseña */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <div className="input-icon-wrapper">
            <Lock size={18} className="input-left-icon" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`form-control input-with-icon input-with-right-btn ${errors.password ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              className="input-right-toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="form-error-msg" role="alert">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block btn-lg mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Autenticando en MockAPI...</span>
          ) : (
            <>
              <LogIn size={18} />
              <span>Ingresar a la Plataforma</span>
            </>
          )}
        </button>
      </form>

      {/* Acceso Rápido para Sustentación Académica de los 10 Roles */}
      <div className="quick-access-section mt-5">
        <div className="quick-access-header">
          <Sparkles size={16} className="text-harvest-amber" />
          <h4 className="quick-access-title">Cuentas Rápidas de Demostración (12 Roles)</h4>
        </div>
        <p className="quick-access-desc">
          Haz clic en cualquiera de los roles para cargar sus credenciales de prueba al instante:
        </p>

        <div className="quick-roles-grid">
          {INITIAL_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              className="quick-role-chip"
              onClick={() => handleQuickFill(u)}
              title={`Cargar ${u.name} (${u.email})`}
            >
              <UserCheck size={14} className="role-chip-icon" />
              <div className="role-chip-text">
                <strong>{u.name}</strong>
                <small>{ROLE_LABELS[u.role]}</small>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="auth-academic-note mt-4">
        <Info size={15} className="note-icon" />
        <p>
          <strong>Nota Académica:</strong> La autenticación consulta directamente el endpoint REST{' '}
          <code>/usuario</code> en MockAPI. Las contraseñas en texto claro son con fines didácticos.
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
