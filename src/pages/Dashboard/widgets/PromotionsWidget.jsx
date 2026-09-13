import React from 'react';
import { Tag, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { isPromotionActiveToday } from '../../../features/promotions/utils/promotionsCalculator.js';

export const PromotionsWidget = ({
  promotions = [],
  title = 'Promociones y Campañas Activas',
}) => {
  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="d-flex align-items-center gap-2">
          <Tag size={20} className="text-harvest-amber" />
          <h3 className="widget-title">{title}</h3>
        </div>
        <span className="badge badge-neutral text-xs">{promotions.length} configuradas</span>
      </div>

      <div className="promotions-list-grid mt-3">
        {promotions.map((promo) => {
          const isActiveToday = isPromotionActiveToday(promo);

          return (
            <div key={promo.id} className="promo-item-box">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <strong className="promo-item-name">{promo.name}</strong>
                {isActiveToday ? (
                  <span className="badge badge-success text-xs d-inline-flex align-items-center gap-1">
                    <CheckCircle2 size={12} />
                    <span>Activa Hoy</span>
                  </span>
                ) : (
                  <span className="badge badge-neutral text-xs d-inline-flex align-items-center gap-1">
                    <XCircle size={12} />
                    <span>Inactiva Hoy</span>
                  </span>
                )}
              </div>

              <p className="promo-item-desc text-xs text-muted mb-2">
                {promo.description}
              </p>

              <div className="d-flex justify-content-between align-items-center text-xs">
                <span className="font-bold text-primary">
                  {promo.discountType === 'percentage' ? `${promo.discountValue}% Descuento` : `$${promo.discountValue} COP`}
                </span>
                {promo.minPurchase > 0 && (
                  <span className="text-muted">Min: ${promo.minPurchase.toLocaleString('es-CO')}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PromotionsWidget;
