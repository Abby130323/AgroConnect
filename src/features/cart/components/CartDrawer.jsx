import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartItem from './CartItem';
import { formatCurrency } from '../../../utils/formatters';

export const CartDrawer = () => {
  const {
    items,
    totals,
    isDrawerOpen,
    closeDrawer,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleNavigateCart = () => {
    closeDrawer();
    navigate('/cart');
  };

  const handleNavigateCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={closeDrawer} role="dialog" aria-modal="true">
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cart-drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={20} className="text-primary" />
            <h3>Canasta de Compras</h3>
            <span className="drawer-badge">{totals.totalUnits} uds</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={closeDrawer}
            aria-label="Cerrar canasta"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="drawer-empty-icon-wrapper">
                <ShoppingBag size={48} className="text-muted" />
              </div>
              <h4>La canasta está vacía</h4>
              <p>Aún no has agregado alimentos frescos o cortes seleccionados a tu pedido.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm mt-3"
                onClick={() => {
                  closeDrawer();
                  navigate('/products');
                }}
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <div className="drawer-items-list">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onIncrement={incrementQuantity}
                  onDecrement={decrementQuantity}
                  onRemove={removeFromCart}
                  compact={true}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-subtotal-row">
              <span>Subtotal estimado:</span>
              <strong className="drawer-subtotal-amount">
                {formatCurrency(totals.subtotal)}
              </strong>
            </div>

            <div className="drawer-actions-grid">
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={handleNavigateCart}
              >
                Ver Canasta Completa
              </button>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={handleNavigateCheckout}
              >
                <span>Continuar Proceso</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
