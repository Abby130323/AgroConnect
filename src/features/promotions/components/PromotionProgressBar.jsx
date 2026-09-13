import React from 'react';
import { Tag, CheckCircle2 } from 'lucide-react';
import { getPromotionProgress } from '../utils/promotionsCalculator.js';

export const PromotionProgressBar = ({ subtotal = 0 }) => {
  const progress = getPromotionProgress(subtotal);

  return (
    <div className="promo-progress-container" role="region" aria-label="Progreso de promociones por volumen">
      <div className="promo-progress-header">
        <div className="d-flex align-items-center gap-2">
          {progress.percentage === 100 ? (
            <CheckCircle2 size={16} className="text-success" />
          ) : (
            <Tag size={16} className="text-harvest-amber" />
          )}
          <span className="promo-progress-label">Ahorro por Volumen</span>
        </div>
        {progress.currentDiscountPercent > 0 && (
          <span className="promo-discount-badge">
            {progress.currentDiscountPercent}% OFF ACTIVO
          </span>
        )}
      </div>

      <p className="promo-progress-message">{progress.message}</p>

      <div className="promo-progress-track">
        <div
          className={`promo-progress-fill ${progress.percentage === 100 ? 'fill-max' : ''}`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="promo-tiers-markers">
        <span className={subtotal >= 100000 ? 'marker-achieved' : ''}>$100k (10%)</span>
        <span className={subtotal >= 200000 ? 'marker-achieved' : ''}>$200k (15%)</span>
        <span className={subtotal >= 300000 ? 'marker-achieved' : ''}>$300k (20%)</span>
      </div>
    </div>
  );
};

export default PromotionProgressBar;
