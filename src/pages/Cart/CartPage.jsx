import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../../features/cart/hooks/useCart';
import CartItem from '../../features/cart/components/CartItem';
import CartSummary from '../../features/cart/components/CartSummary';
import EmptyState from '../../components/feedback/EmptyState';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    totals,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page py-5">
        <div className="container">
          <EmptyState
            icon={ShoppingBag}
            title="La canasta de compras está vacía"
            message="No tienes productos agregados. Visita nuestro catálogo para elegir cortes seleccionados o alimentos frescos del campo."
            actionLabel="Explorar Catálogo de Productos"
            onAction={() => navigate('/products')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page py-5">
      <div className="container">
        <div className="cart-page-header">
          <h1 className="page-title">Canasta de Compras</h1>
          <span className="cart-items-count-badge">
            {totals.totalUnits} {totals.totalUnits === 1 ? 'unidad' : 'unidades'} en total
          </span>
        </div>

        <div className="cart-page-layout">
          {/* Listado de Productos */}
          <div className="cart-items-column">
            <div className="cart-table-card">
              <div className="cart-table-header">
                <span>Producto</span>
                <span>Precio / Unidad</span>
                <span>Cantidad</span>
                <span>Subtotal</span>
              </div>

              <div className="cart-items-list-body">
                {items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              <div className="cart-table-footer">
                <Link to="/products" className="btn btn-outline-secondary btn-sm">
                  <ArrowLeft size={16} />
                  <span>Continuar explorando productos</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={clearCart}
                >
                  <Trash2 size={16} />
                  <span>Vaciar Canasta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Resumen de Liquidación */}
          <div className="cart-summary-column">
            <CartSummary
              totals={totals}
              onCheckout={() => navigate('/checkout')}
              onClearCart={clearCart}
              showClearBtn={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
