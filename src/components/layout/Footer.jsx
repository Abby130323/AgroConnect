import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Truck, Store, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        {/* Grilla Principal del Footer */}
        <div className="footer-grid">
          {/* Columna 1: Marca y Misión */}
          <div className="footer-col footer-col-brand">
            <Link to="/" className="brand-logo footer-logo" aria-label="AgroConnect - Inicio">
              <div className="brand-icon-wrapper">
                <Sprout className="brand-icon-svg" size={24} />
              </div>
              <div className="brand-text">
                <span className="brand-name">AgroConnect</span>
                <span className="brand-tagline">Mercado Agroalimentario</span>
              </div>
            </Link>
            <p className="footer-desc">
              Plataforma de comercio agropecuario orientada a la venta directa de alimentos frescos, 
              cortes seleccionados y cosechas de familias campesinas a hogares y negocios.
            </p>
          </div>

          {/* Columna 2: Departamentos y Catálogo */}
          <div className="footer-col">
            <h4 className="footer-heading">Departamentos</h4>
            <ul className="footer-links">
              <li><Link to="/products">Catálogo General</Link></li>
              <li><Link to="/products?category=1">Carnes de Res Seleccionadas</Link></li>
              <li><Link to="/products?category=2">Carne de Cerdo de Origen</Link></li>
              <li><Link to="/products?category=3">Frutas Frescas de Temporada</Link></li>
              <li><Link to="/products?category=4">Verduras y Huerta Campesina</Link></li>
            </ul>
          </div>

          {/* Columna 3: Mi Cuenta y Servicios */}
          <div className="footer-col">
            <h4 className="footer-heading">Acceso y Servicios</h4>
            <ul className="footer-links">
              <li><Link to="/cart">Canasta de Compras</Link></li>
              <li><Link to="/dashboard">Panel de Usuario / Compras</Link></li>
              <li><Link to="/login">Acceso para Productores</Link></li>
              <li><Link to="/admin/products">Gestión de Catálogo</Link></li>
            </ul>
          </div>

          {/* Columna 4: Compromiso de Servicio */}
          <div className="footer-col">
            <h4 className="footer-heading">Compromiso AgroConnect</h4>
            <ul className="footer-features-list">
              <li>
                <Store size={15} className="footer-feature-icon" />
                <span>Comercio directo con productores rurales</span>
              </li>
              <li>
                <Truck size={15} className="footer-feature-icon" />
                <span>Transporte especializado según el tipo de producto</span>
              </li>
              <li>
                <ShieldCheck size={15} className="footer-feature-icon" />
                <span>Pesaje exacto y alimentos 100% frescos</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior de Copyright */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} AgroConnect. Plataforma de comercio agroalimentario directo.
          </p>
          <div className="footer-bottom-links">
            <span>Calidad garantizada</span>
            <span>•</span>
            <span>Origen campesino</span>
            <span>•</span>
            <span>Tecnología rural</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
