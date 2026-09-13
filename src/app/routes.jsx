import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Páginas Públicas
import HomePage from '../pages/Home/HomePage.jsx';
import ProductsPage from '../pages/Products/ProductsPage.jsx';
import ProductDetailPage from '../pages/ProductDetail/ProductDetailPage.jsx';
import CartPage from '../pages/Cart/CartPage.jsx';
import CheckoutPage from '../pages/Checkout/CheckoutPage.jsx';
import LoginPage from '../pages/Login/LoginPage.jsx';
import ForbiddenPage from '../pages/Forbidden/ForbiddenPage.jsx';
import NotFoundPage from '../pages/NotFound/NotFoundPage.jsx';

// Páginas Protegidas y de Administración
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';
import AdminProductsPage from '../pages/AdminProducts/AdminProductsPage.jsx';
import AdminPromotionsPage from '../pages/AdminPromotions/AdminPromotionsPage.jsx';
import AdminUsersPage from '../pages/AdminUsers/AdminUsersPage.jsx';

// Componentes de Seguridad y Autorización RBAC
import ProtectedRoute from '../components/common/ProtectedRoute.jsx';
import RoleRoute from '../components/common/RoleRoute.jsx';
import { USER_ROLES } from '../features/auth/models/userModel.js';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/403" element={<ForbiddenPage />} />

      {/* Rutas Protegidas de Usuario (Dashboard dinámico según rol) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Alias para panel de ganaderos */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        }
      />

      {/* Rutas Administrativas Protegidas por Rol */}
      <Route
        path="/admin/products"
        element={
          <RoleRoute
            allowedRoles={[
              USER_ROLES.ADMIN,
              USER_ROLES.EMPLEADO_INVENTARIO,
              USER_ROLES.GANADERO_PORCINO,
              USER_ROLES.GANADERO_BOVINO,
              USER_ROLES.GANADERO_AVICOLA,
            ]}
          >
            <AdminProductsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/promotions"
        element={
          <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminPromotionsPage />
          </RoleRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AdminUsersPage />
          </RoleRoute>
        }
      />

      {/* Ruta 404 No Encontrada */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
