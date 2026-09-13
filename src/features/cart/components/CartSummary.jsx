import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Info, Trash2, Tag } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import PromotionProgressBar from '../../promotions/components/PromotionProgressBar.jsx';

export const CartSummary = ({
  totals,
  onCheckout,
  onClearCart,
  showClearBtn = true,
  isProcessing = false,
}) => {
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  const hasItems = totals.totalUnits > 0;

  return (
    <div className="cart-summary-card">
      <h3 className="cart-summary-title">Resumen de la Compra</h3>

      {hasItems && (
        <div className="mb-3">
          <PromotionProgressBar subtotal={totals.subtotal} />
        </div>
      )}

      <div className="cart-summary-rows">
        <div className="cart-summary-row">
          <span>Productos distintos</span>
          <span className="summary-value">{totals.totalItems}</span>
        </div>

        <div className="cart-summary-row">
          <span>Unidades totales</span>
          <span className="summary-value">{totals.totalUnits} uds</span>
        </div>

        <div className="cart-summary-row">
          <span>Subtotal</span>
          <span className="summary-value">{formatCurrency(totals.subtotal)}</span>
        </div>

        {totals.discount > 0 && (
          <div className="cart-summary-row text-success">
            <span className="d-flex align-items-center gap-1">
              <Tag size={14} />
              <span>Descuento aplicado</span>
            </span>
            <span className="summary-value text-success font-bold">
              -{formatCurrency(totals.discount)}
            </span>
          </div>
        )}

        <div className="cart-summary-row">
          <span>Envío logístico</span>
          <span className="summary-value">
            {totals.shipping === 0 ? (
              <strong className="text-success">Gratis</strong>
            ) : (
              formatCurrency(totals.shipping)
            )}
          </span>
        </div>

        {totals.shipping > 0 && (
          <div className="shipping-hint">
            <Info size={14} />
            <span>Envío sin costo en compras superiores a {formatCurrency(80000)}</span>
          </div>
        )}

        <div className="cart-summary-divider" />

        <div className="cart-summary-row cart-summary-total">
          <span>Total a liquidar</span>
          <span className="total-amount">{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <div className="cart-summary-actions">
        <button
          type="button"
          className="btn btn-primary btn-block btn-lg"
          onClick={handleCheckoutClick}
          disabled={!hasItems || isProcessing}
        >
          <span>{isProcessing ? 'Procesando pedido...' : 'Continuar con la Entrega'}</span>
          <ArrowRight size={18} />
        </button>

        {showClearBtn && hasItems && (
          <button
            type="button"
            className="btn btn-outline-danger btn-block btn-sm mt-2"
            onClick={onClearCart}
          >
            <Trash2 size={14} />
            <span>Vaciar Canasta</span>
          </button>
        )}
      </div>

      <div className="cart-guarantee-note">
        <ShieldCheck size={16} className="inline-icon" />
        <span>Comercialización directa y trazabilidad garantizada desde origen.</span>
      </div>
    </div>
  );
};

export default CartSummary;
