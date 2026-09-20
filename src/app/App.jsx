import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '../features/auth/context/AuthContext.jsx';
import { ToastProvider } from '../context/ToastContext.jsx';
import { CartProvider } from '../features/cart/context/CartContext.jsx';
import Layout from '../components/layout/Layout.jsx';
import AppRoutes from './routes.jsx';

export const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Layout>
              <AppRoutes />
            </Layout>
            <Toaster position="top-right" richColors closeButton />
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
