import React from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';
import QuantitySelector from './QuantitySelector';

export const CartItem = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  compact = false,
}) => {
  const itemSubtotal = item.price * item.quantity;
  const isOutOfStock = item.stock <= 0;
  const isMaxStockReached = item.quantity >= item.stock;
  const itemImage = item.imageUrl || item.image;

  return (
    <div className={`cart-item ${compact ? 'cart-item-compact' : ''} ${isOutOfStock ? 'cart-item-warning' : ''}`}>
      <div className="cart-item-image-wrapper">
        <img
          src={itemImage}
          alt={`Fotografía de ${item.name}`}
          className="cart-item-image"
          loading="lazy"
        />
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <h4 className="cart-item-title">{item.name}</h4>
          <button
            type="button"
            className="cart-item-remove-btn"
            onClick={() => onRemove(item.productId)}
            aria-label={`Eliminar ${item.name} de la canasta`}
            title="Eliminar producto"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="cart-item-pricing">
          <span className="cart-item-unit-price">
            {formatCurrency(item.price)} <small>/ {item.unit || 'kg'}</small>
          </span>
          <span className="cart-item-subtotal">
            {formatCurrency(itemSubtotal)}
          </span>
        </div>

        {isOutOfStock && (
          <div className="cart-stock-alert">
            <AlertCircle size={14} />
            <span>Sin existencias disponibles en inventario.</span>
          </div>
        )}

        {!isOutOfStock && isMaxStockReached && (
          <div className="cart-stock-hint">
            <span>Máximo disponible: {item.stock} {item.unit || 'uds'}</span>
          </div>
        )}

        <div className="cart-item-actions">
          <QuantitySelector
            quantity={item.quantity}
            maxStock={item.stock}
            onIncrement={() => onIncrement(item.productId)}
            onDecrement={() => onDecrement(item.productId)}
            size={compact ? 'sm' : 'md'}
            disabled={isOutOfStock}
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
