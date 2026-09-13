import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

export const CartButton = ({ onClick }) => {
  const { totals, toggleDrawer } = useCart();
  const handleClick = onClick || toggleDrawer;

  return (
    <button
      type="button"
      className="cart-button"
      onClick={handleClick}
      aria-label={`Ver carrito de compras con ${totals.totalUnits} unidades`}
      title="Canasta de compras"
    >
      <ShoppingCart size={20} className="cart-icon-svg" />
      <span className="cart-label">Canasta</span>
      {totals.totalUnits > 0 && (
        <span className="cart-badge animate-badge" aria-hidden="true">
          {totals.totalUnits > 99 ? '99+' : totals.totalUnits}
        </span>
      )}
    </button>
  );
};

export default CartButton;
