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
  Search,
  Sparkles
} from 'lucide-react';
import CartButton from '../../features/cart/components/CartButton';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { ROLE_LABELS, USER_ROLES } from '../../features/auth/models/userModel.js';

export const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const closeMobileNav = () => setIsMobileNavOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileNav();
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      closeMobileNav();
    }
  };

  return (
    <header className="app-header">
      {/* 1. Barra Superior de Servicios de Supermercado */}
      <div className="header-top-bar">
        <div className="container header-top-container">
          <div className="header-top-left">
            <span className="top-bar-badge">AgroConnect Directo</span>
            <span className="top-bar-text">Alimentos frescos del campo a tu mesa sin intermediación innecesaria</span>
          </div>
          <div className="header-top-right">
            {isAuthenticated ? (
              <span className="top-bar-user-status">
                Sesión iniciada como <strong>{user?.name}</strong> ({ROLE_LABELS[user?.role] || user?.role})
              </span>
            ) : (
              <Link to="/login" className="top-bar-login-link">
                Acceso a Productores y Clientes
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Barra Principal de Navegación y Búsqueda */}
      <div className="header-main-bar">
        <div className="header-container container">
          {/* Logotipo AgroConnect */}
          <Link to="/" className="brand-logo" onClick={closeMobileNav} aria-label="AgroConnect - Inicio">
            <div className="brand-icon-wrapper">
              <Sprout className="brand-icon-svg" size={24} />
            </div>
            <div className="brand-text">
              <span className="brand-name">AgroConnect</span>
              <span className="brand-tagline">Mercado Agroalimentario</span>
            </div>
          </Link>

          {/* Buscador de Supermercado (Desktop y Tablet) */}
          <form className="header-search-box" onSubmit={handleSearchSubmit}>
            <Search className="header-search-icon" size={18} />
            <input
              type="text"
              className="header-search-input"
              placeholder="Buscar cortes de carne, frutas, verduras, café..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar productos en el catálogo"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="header-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
          </form>

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
                  <LayoutDashboard size={15} />
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
                      : user?.role === USER_ROLES.TRANSPORTADOR
                      ? 'Rutas Despacho'
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
                    <Settings size={15} />
                    <span>
                      {user?.role === USER_ROLES.GANADERO_PORCINO
                        ? 'Control Cerdo'
                        : user?.role === USER_ROLES.GANADERO_BOVINO
                        ? 'Control Res'
                        : user?.role === USER_ROLES.GANADERO_AVICOLA
                        ? 'Control Aves'
                        : user?.role === USER_ROLES.AGRICULTOR
                        ? 'Control Fruver'
                        : user?.role === USER_ROLES.EMPLEADO_INVENTARIO
                        ? 'Inventario'
                        : 'Admin CRUD'}
                    </span>
                  </NavLink>
                )}
              </>
            ) : null}
          </nav>

          {/* Acciones: Perfil de Usuario, Carrito y Botón Móvil */}
          <div className="header-actions">
            {isAuthenticated ? (
              <div className="desktop-user-menu">
                <div className="user-profile-preview">
                  <span className="user-name-text">{user.name}</span>
                  <span className="badge badge-primary user-role-badge">
                    {ROLE_LABELS[user.role] || user.role}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn-user-logout"
                  onClick={handleLogout}
                  title="Cerrar Sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-outline-primary btn-sm btn-header-login">
                <LogIn size={15} />
                <span>Ingresar</span>
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
      </div>

      {/* 3. Menú Móvil Desplegable (Drawer) */}
      {isMobileNavOpen && (
        <div className="mobile-nav-backdrop" onClick={closeMobileNav}>
          <nav
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Navegación móvil"
          >
            <div className="mobile-nav-header">
              <div className="d-flex align-items-center gap-2">
                <div className="brand-icon-wrapper-sm">
                  <Sprout size={18} className="text-primary" />
                </div>
                <span className="mobile-nav-title">AgroConnect</span>
              </div>
              <button
                type="button"
                className="mobile-nav-close"
                onClick={closeMobileNav}
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            {/* Búsqueda en Móvil */}
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <div className="mobile-search-input-wrapper">
                <Search size={16} className="text-muted" />
                <input
                  type="text"
                  placeholder="Buscar en el catálogo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                />
              </div>
            </form>

            {/* Perfil en Menú Móvil */}
            {isAuthenticated ? (
              <div className="mobile-user-profile">
                <div className="d-flex align-items-center gap-2">
                  <div className="user-avatar-circle">
                    <User size={18} />
                  </div>
                  <div>
                    <strong className="d-block">{user.name}</strong>
                    <span className="badge badge-primary user-role-badge mt-1">
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
                <span>Inicio</span>
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileNav}
              >
                <Store size={18} />
                <span>Catálogo de Alimentos</span>
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
                  <div className="mobile-nav-divider" />
                  <span className="mobile-nav-section-label">Panel Operativo</span>

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
                        ? 'Panel Porcino (Cortes Cerdo)'
                        : user?.role === USER_ROLES.GANADERO_BOVINO
                        ? 'Panel Bovino (Cortes Res)'
                        : user?.role === USER_ROLES.GANADERO_AVICOLA
                        ? 'Panel Avícola (Pollo y Huevos)'
                        : user?.role === USER_ROLES.AGRICULTOR
                        ? 'Panel Agrícola (Fruver y Granos)'
                        : user?.role === USER_ROLES.TRANSPORTADOR
                        ? 'Rutas de Despacho Logístico'
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
                          ? 'Control Exclusivo Aves'
                          : user?.role === USER_ROLES.AGRICULTOR
                          ? 'Control Cosechas y Fruver'
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

            <div className="mobile-nav-footer">
              <p className="mobile-nav-note">
                AgroConnect — Comercio directo entre familias campesinas y consumidores.
              </p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
