import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="not-found-page py-5">
      <div className="container text-center">
        <div className="not-found-card">
          <div className="not-found-icon-wrapper">
            <HelpCircle size={56} className="text-muted" />
          </div>
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Página no encontrada</h2>
          <p className="not-found-desc">
            La ruta especificada no existe o fue trasladada a otra sección del catálogo.
          </p>
          <div className="mt-4">
            <Link to="/" className="btn btn-primary btn-lg">
              <ArrowLeft size={18} />
              <span>Volver a la Página Principal</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
