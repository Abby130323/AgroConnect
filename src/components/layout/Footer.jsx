import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-col footer-col-brand">
            <div className="brand-logo footer-logo">
              <div className="brand-icon-wrapper">
                <Sprout className="brand-icon-svg" size={24} />
              </div>
              <span className="brand-name">AgroConnect</span>
            </div>
            <p className="footer-desc">
              Plataforma digital orientada a la comercialización directa de carnes selectas,
              frutas, hortalizas y productos agrícolas de origen campesino, garantizando
              trazabilidad y precios justos.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Navegación</h4>
            <ul className="footer-links">
              <li><Link to="/">Página Principal</Link></li>
              <li><Link to="/products">Catálogo de Alimentos</Link></li>
              <li><Link to="/cart">Canasta de Compras</Link></li>
              <li><Link to="/admin/products">Panel Administrativo</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Especificación Técnica</h4>
            <ul className="footer-tech-list">
              <li>React 19 + Vite</li>
              <li>Capa de servicios REST desacoplada</li>
              <li>Persistencia local sincronizada</li>
              <li>Diseño adaptativo mobile-first</li>
              <li>Carga concurrente con Promise.all()</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AgroConnect. Proyecto de Desarrollo Web — Tecnológico de Antioquia.</p>
          <p className="footer-subtext">Arquitectura por capas para sustentación académica de ingeniería de software.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
