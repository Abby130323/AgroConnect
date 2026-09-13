import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import PromotionCountdown from './PromotionCountdown.jsx';

export const PromotionBanner = ({ promotion }) => {
  if (!promotion) return null;

  return (
    <section className="promo-banner-section" aria-label="Banner Promocional AgroConnect">
      <div className="promo-banner-card">
        <div className="promo-banner-image-box">
          <img
            src={promotion.bannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80'}
            alt={`Promoción comercial: ${promotion.bannerTitle || promotion.name}`}
            className="promo-banner-img"
            loading="lazy"
          />
          <div className="promo-banner-overlay" />
        </div>

        <div className="promo-banner-content">
          <div className="promo-pill-badge">
            <Sparkles size={14} />
            <span>OFERTA EXCLUSIVA DIRECTA DEL CAMPO</span>
          </div>

          <h2 className="promo-banner-title">
            {promotion.bannerTitle || promotion.name}
          </h2>

          <p className="promo-banner-description">
            {promotion.bannerDescription || promotion.description}
          </p>

          <div className="promo-banner-footer">
            <PromotionCountdown />
            <Link to="/products" className="btn btn-primary btn-lg promo-cta-btn">
              <span>{promotion.bannerCta || 'Comprar Ahora'}</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
