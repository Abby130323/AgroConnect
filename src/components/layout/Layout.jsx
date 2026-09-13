import React from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../../features/cart/components/CartDrawer';

export const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Header />
      <main className="main-content" id="main-content">
        {children}
      </main>
      <CartDrawer />
      <Footer />
    </div>
  );
};

export default Layout;
