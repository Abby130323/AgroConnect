import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters.js';

const STORAGE_KEY = 'agroconnect_promo_modal_last_shown';
const COOLDOWN_MINUTES = 30; // No molestar repetidamente en menos de 30 minutos

export const PromotionalModal = ({ promotion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Evaluar si ya se mostró recientemente
    try {
      const lastShown = localStorage.getItem(STORAGE_KEY);
      if (lastShown) {
        const diffMs = Date.now() - Number(lastShown);
        const diffMinutes = diffMs / (1000 * 60);
        if (diffMinutes < COOLDOWN_MINUTES) {
          return;
        }
      }
    } catch {
      // Ignorar error de storage
    }

    // Mostrar automáticamente tras 2.5 segundos de navegación
    const timer = setTimeout(() => {
      setIsOpen(true);
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        // Ignorar
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAction = () => {
    setIsOpen(false);
    navigate('/products');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop promo-modal-backdrop" onClick={handleClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="promo-popup-card"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Oferta comercial especial"
        >
          {/* Botón de cierre claramente visible */}
          <button
            type="button"
            className="promo-popup-close"
            onClick={handleClose}
            aria-label="Cerrar oferta publicitaria"
          >
            <X size={20} />
          </button>

          <div className="promo-popup-media">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Cortes de carnes y cosecha fresca"
              className="promo-popup-img"
            />
            <div className="promo-popup-pill">
              <Sparkles size={14} />
              <span>OFERTA EXCLUSIVA DE TEMPORADA</span>
            </div>
          </div>

          <div className="promo-popup-body">
            <h3 className="promo-popup-title">
              ¡Hasta 20% de Descuento en tu Canasta!
            </h3>
            <p className="promo-popup-subtitle">
              Compra alimentos frescos y cortes cárnicos seleccionados directo de nuestros campesinos y ganaderos.
            </p>

            <div className="promo-popup-benefits">
              <div className="benefit-badge-item">
                <ShoppingBag size={16} />
                <span>A partir de $100.000 obtienes 10% inmediato</span>
              </div>
              <div className="benefit-badge-item">
                <ShoppingBag size={16} />
                <span>Compras superiores a $200.000 obtienen 15%</span>
              </div>
              <div className="benefit-badge-item highlight">
                <Sparkles size={16} />
                <span>Compras de $300.000 o más obtienen 20% OFF</span>
              </div>
            </div>

            <div className="promo-popup-actions mt-4">
              <button
                type="button"
                className="btn btn-primary btn-block btn-lg"
                onClick={handleAction}
              >
                <span>Aprovechar Descuento Ahora</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PromotionalModal;
