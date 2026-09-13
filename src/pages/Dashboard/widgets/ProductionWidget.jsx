import React from 'react';
import { Beef, Egg, ShieldCheck, MapPin, Award } from 'lucide-react';
import { USER_ROLES } from '../../../features/auth/models/userModel.js';
import { formatCurrency } from '../../../utils/formatters.js';

export const ProductionWidget = ({
  user,
  farmer,
  products = [],
  specialtyTitle,
  userRole,
}) => {
  const IconComponent = userRole === USER_ROLES.GANADERO_AVICOLA ? Egg : Beef;

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="d-flex align-items-center gap-2">
          <IconComponent size={20} className="text-harvest-amber" />
          <h3 className="widget-title">Ficha de Producción Agropecuaria</h3>
        </div>
        <span className="badge badge-primary text-xs">Trazabilidad de Origen</span>
      </div>

      <div className="production-banner p-4 bg-muted rounded my-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="font-bold text-lg mb-1">{farmer?.farmName || user?.title || 'Finca y Unidad Productiva'}</h4>
            <p className="text-muted text-sm mb-0">
              <MapPin size={14} className="d-inline mr-1" />
              {farmer?.location || 'Colombia • Producción Agroecológica Sostenible'}
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <ShieldCheck size={22} className="text-success" />
            <div className="text-xs">
              <strong className="d-block">Certificación Sanitaria</strong>
              <span className="text-muted">Buenas Prácticas Ganaderas</span>
            </div>
          </div>
        </div>
      </div>

      <h4 className="text-sm font-bold text-muted text-uppercase mb-3">
        {specialtyTitle || 'Cortes y Productos Propios en el Catálogo'} ({products.length} referencias)
      </h4>

      <div className="production-cards-grid">
        {products.map((prod) => (
          <div key={prod.id} className="production-item-card">
            <img
              src={prod.imageUrl || prod.image}
              alt={prod.name}
              className="production-item-img"
            />
            <div className="production-item-body">
              <span className="production-item-title">{prod.name}</span>
              <div className="d-flex gap-2 flex-wrap text-xs text-muted mb-2">
                <span>Presentación: {prod.presentation || prod.unit || 'kg'}</span>
                {prod.conservation && <span>• {prod.conservation}</span>}
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="production-item-price">{formatCurrency(prod.price)}</span>
                <span className="badge badge-neutral text-xs">Stock: {prod.stock} {prod.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionWidget;
