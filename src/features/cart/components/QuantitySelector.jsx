import React from 'react';

export const QuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  maxStock,
  min = 1,
  size = 'md',
  disabled = false,
}) => {
  const isMinDisabled = disabled || quantity <= min;
  const isMaxDisabled = disabled || (maxStock !== undefined && quantity >= maxStock);

  return (
    <div className={`quantity-selector quantity-selector-${size}`}>
      <button
        type="button"
        className="qty-btn qty-btn-dec"
        onClick={onDecrement}
        disabled={isMinDisabled}
        aria-label="Disminuir cantidad"
      >
        −
      </button>

      <span className="qty-display" aria-live="polite" aria-label={`Cantidad actual: ${quantity}`}>
        {quantity}
      </span>

      <button
        type="button"
        className="qty-btn qty-btn-inc"
        onClick={onIncrement}
        disabled={isMaxDisabled}
        aria-label="Incrementar cantidad"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
