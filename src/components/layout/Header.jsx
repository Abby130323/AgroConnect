import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Store, 
  Settings, 
  Menu, 
  X, 
  ShoppingBag, 
  LogIn, 
  LogOut, 
  LayoutDashboard, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import CartButton from '../../features/cart/components/CartButton';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { ROLE_LABELS, USER_ROLES } from '../../features/auth/models/userModel.js';

export const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const closeMobileNav = () => setIsMobileNavOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileNav();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container container">
        {/* Logotipo vectorial profesional */}
        <Link to="/" className="brand-logo" onClick={closeMobileNav}>
          <div className="brand-icon-wrapper">
            <Sprout className="brand-icon-svg" size={26} />
          </div>
          <div className="brand-text">
            <span className="brand-name">AgroConnect</span>
            <span className="brand-tagline">Comercio Agrícola y Alimentos</span>
          </div>
        </Link>

        {/* Navegación Desktop */}
        <nav className="desktop-nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Catálogo
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link nav-link-dashboard ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={16} />
                <span>
                  {user?.role === USER_ROLES.CLIENTE
                    ? 'Mis Compras'
                    : user?.role === USER_ROLES.GANADERO_PORCINO
                    ? 'Panel Porcino'
                    : user?.role === USER_ROLES.GANADERO_BOVINO
                    ? 'Panel Bovino'
                    : user?.role === USER_ROLES.GANADERO_AVICOLA
                    ? 'Panel Avícola'
                    : user?.role === USER_ROLES.AGRICULTOR
                    ? 'Panel Agrícola'
                    : 'Mi Panel'}
                </span>
              </NavLink>

              {(user?.role === USER_ROLES.ADMIN ||
                user?.role === USER_ROLES.EMPLEADO_INVENTARIO ||
                user?.role === USER_ROLES.GANADERO_PORCINO ||
                user?.role === USER_ROLES.GANADERO_BOVINO ||
                user?.role === USER_ROLES.GANADERO_AVICOLA ||
                user?.role === USER_ROLES.AGRICULTOR) && (
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) => `nav-link nav-link-admin ${isActive ? 'active' : ''}`}
                >
                  <Settings size={16} />
                  <span>
                    {user?.role === USER_ROLES.GANADERO_PORCINO
                      ? 'Control Cerdo'
                      : user?.role === USER_ROLES.GANADERO_BOVINO
                      ? 'Control Res'
                      : user?.role === USER_ROLES.GANADERO_AVICOLA
                      ? 'Control Huevos/Pollo'
                      : user?.role === USER_ROLES.AGRICULTOR
                      ? 'Control Cosechas/Fruver'
                      : user?.role === USER_ROLES.EMPLEADO_INVENTARIO
                      ? 'Inventario CRUD'
                      : 'Admin CRUD'}
                  </span>
                </NavLink>
              )}
            </>
          ) : null}
        </nav>

        {/* Acciones: Usuario, Carrito y Menú Móvil */}
        <div className="header-actions d-flex align-items-center gap-3">
          {isAuthenticated ? (
            <div className="desktop-user-menu d-none d-md-flex align-items-center gap-2">
              <div className="user-profile-preview">
                <span className="user-name-text font-bold text-xs">{user.name}</span>
                <span className="badge badge-primary text-xs d-block">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleLogout}
                title="Cerrar Sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline-primary btn-sm d-none d-md-inline-flex">
              <LogIn size={15} />
              <span>Iniciar Sesión</span>
            </Link>
          )}

          <CartButton />

          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-expanded={isMobileNavOpen}
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileNavOpen && (
        <div className="mobile-nav-backdrop" onClick={closeMobileNav}>
          <nav
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navegación móvil"
          >
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Navegación Principal</span>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={closeMobileNav}
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            {/* Perfil Móvil */}
            {isAuthenticated ? (
              <div className="mobile-user-profile mb-3 p-3 bg-muted rounded">
                <div className="d-flex align-items-center gap-2">
                  <User size={18} className="text-primary" />
                  <div>
                    <strong>{user.name}</strong>
                    <span className="badge badge-primary text-xs d-block mt-1">
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mobile-nav-links">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileNav}
              >
                Inicio
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileNav}
              >
                <Store size={18} />
                <span>Catálogo de Productos</span>
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileNav}
              >
                <ShoppingBag size={18} />
                <span>Canasta de Compras</span>
              </NavLink>

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                    onClick={closeMobileNav}
                  >
                    <LayoutDashboard size={18} />
                    <span>
                      {user?.role === USER_ROLES.CLIENTE
                        ? 'Mis Compras y Pedidos'
                        : user?.role === USER_ROLES.GANADERO_PORCINO
                        ? 'Panel Porcino (Carne de Cerdo)'
                        : user?.role === USER_ROLES.GANADERO_BOVINO
                        ? 'Panel Bovino (Carne de Res)'
                        : user?.role === USER_ROLES.GANADERO_AVICOLA
                        ? 'Panel Avícola (Huevos y Pollo)'
                        : user?.role === USER_ROLES.AGRICULTOR
                        ? 'Panel Agrícola (Fruver y Huerta)'
                        : 'Mi Panel de Control'}
                    </span>
                  </NavLink>

                  {(user?.role === USER_ROLES.ADMIN ||
                    user?.role === USER_ROLES.EMPLEADO_INVENTARIO ||
                    user?.role === USER_ROLES.GANADERO_PORCINO ||
                    user?.role === USER_ROLES.GANADERO_BOVINO ||
                    user?.role === USER_ROLES.GANADERO_AVICOLA ||
                    user?.role === USER_ROLES.AGRICULTOR) && (
                    <NavLink
                      to="/admin/products"
                      className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={closeMobileNav}
                    >
                      <Settings size={18} />
                      <span>
                        {user?.role === USER_ROLES.GANADERO_PORCINO
                          ? 'Control Exclusivo Cerdo'
                          : user?.role === USER_ROLES.GANADERO_BOVINO
                          ? 'Control Exclusivo Res'
                          : user?.role === USER_ROLES.GANADERO_AVICOLA
                          ? 'Control Exclusivo Huevos y Pollo'
                          : user?.role === USER_ROLES.AGRICULTOR
                          ? 'Control Exclusivo Cosechas y Fruver'
                          : user?.role === USER_ROLES.EMPLEADO_INVENTARIO
                          ? 'Gestión de Inventario'
                          : 'CRUD Productos'}
                      </span>
                    </NavLink>
                  )}

                  {user?.role === USER_ROLES.ADMIN && (
                    <>
                      <NavLink
                        to="/admin/promotions"
                        className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                        onClick={closeMobileNav}
                      >
                        <Settings size={18} />
                        <span>CRUD Promociones</span>
                      </NavLink>
                      <NavLink
                        to="/admin/users"
                        className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                        onClick={closeMobileNav}
                      >
                        <Settings size={18} />
                        <span>CRUD Usuarios</span>
                      </NavLink>
                    </>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-block mt-3"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary btn-block mt-3"
                  onClick={closeMobileNav}
                >
                  <LogIn size={16} />
                  <span>Iniciar Sesión</span>
                </Link>
              )}
            </div>

            <div className="mobile-nav-footer mt-auto">
              <p className="mobile-nav-note">
                AgroConnect — Plataforma de comercio directo entre productores rurales y consumidores.
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
