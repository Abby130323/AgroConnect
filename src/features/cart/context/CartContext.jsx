import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import cartStorage from '../utils/cartStorage';
import { useToast } from '../../../context/ToastContext';
import promotionService from '../../promotions/services/promotionService.js';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Inicialización lazy desde localStorage
  const [items, setItems] = useState(() => cartStorage.loadCart());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    cartStorage.saveCart(items);
  }, [items]);

  /**
   * Agrega un producto al carrito respetando el stock disponible.
   * Actualización inmutable.
   * @param {Object} product - Producto con { id, name, price, image, unit, stock }
   * @param {number} requestedQty - Cantidad a agregar (por defecto 1)
   */
  const addToCart = useCallback((product, requestedQty = 1) => {
    if (!product || product.stock <= 0) {
      addToast('Este producto se encuentra agotado.', 'warning');
      return false;
    }

    let errorMsg = null;
    let addedSuccessfully = false;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => String(item.productId) === String(product.id));

      if (existingIndex > -1) {
        const currentItem = prevItems[existingIndex];
        const newQty = currentItem.quantity + requestedQty;

        if (newQty > product.stock) {
          errorMsg = `No hay más unidades disponibles. Stock máximo: ${product.stock} ${product.unit || 'uds'}.`;
          return prevItems;
        }

        addedSuccessfully = true;
        // Inmutable: map()
        return prevItems.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: newQty, stock: product.stock, price: product.price }
            : item
        );
      } else {
        if (requestedQty > product.stock) {
          errorMsg = `No puedes agregar más del stock disponible (${product.stock} ${product.unit || 'uds'}).`;
          return prevItems;
        }

        addedSuccessfully = true;
        // Inmutable: spread operator
        const newItem = {
          productId: String(product.id),
          name: product.name,
          price: Number(product.price),
          image: product.image,
          unit: product.unit || 'kg',
          stock: Number(product.stock),
          quantity: requestedQty,
        };

        return [...prevItems, newItem];
      }
    });

    if (errorMsg) {
      addToast(errorMsg, 'warning');
      return false;
    }

    if (addedSuccessfully) {
      addToast(`"${product.name}" agregado al carrito.`, 'success');
      return true;
    }

    return false;
  }, [addToast]);

  /**
   * Incrementa en 1 la cantidad del item sin superar el stock
   * @param {string} productId
   */
  const incrementQuantity = useCallback((productId) => {
    let limitReached = false;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.productId) === String(productId)) {
          if (item.quantity >= item.stock) {
            limitReached = true;
            return item;
          }
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );

    if (limitReached) {
      addToast('No hay más unidades disponibles en stock.', 'warning');
    }
  }, [addToast]);

  /**
   * Disminuye en 1 la cantidad del item (mínimo 1)
   * @param {string} productId
   */
  const decrementQuantity = useCallback((productId) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.productId) === String(productId)) {
          return { ...item, quantity: Math.max(1, item.quantity - 1) };
        }
        return item;
      })
    );
  }, []);

  /**
   * Actualiza directamente la cantidad a un valor específico válido
   * @param {string} productId
   * @param {number} newQuantity
   */
  const updateQuantity = useCallback((productId, newQuantity) => {
    const qty = Math.floor(Number(newQuantity));
    if (isNaN(qty) || qty < 1) return;

    let toastMsg = null;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.productId) === String(productId)) {
          if (qty > item.stock) {
            toastMsg = `Cantidad ajustada al stock máximo (${item.stock}).`;
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );

    if (toastMsg) {
      addToast(toastMsg, 'info');
    }
  }, [addToast]);

  /**
   * Elimina un producto específico del carrito
   * @param {string} productId
   */
  const removeFromCart = useCallback((productId) => {
    setItems((prevItems) => {
      const removedItem = prevItems.find((i) => String(i.productId) === String(productId));
      if (removedItem) {
        addToast(`"${removedItem.name}" eliminado del carrito.`, 'info');
      }
      // Inmutable: filter()
      return prevItems.filter((item) => String(item.productId) !== String(productId));
    });
  }, [addToast]);

  /**
   * Vacía completamente el carrito
   */
  const clearCart = useCallback(() => {
    setItems([]);
    cartStorage.clearCart();
    addToast('Carrito vaciado.', 'info');
  }, [addToast]);

  /**
   * Sincronización defensiva con el catálogo en vivo:
   * Si un producto fue eliminado o cambió su stock/precio, adapta el carrito.
   * @param {Array} catalogProducts
   */
  const syncWithCatalog = useCallback((catalogProducts) => {
    if (!Array.isArray(catalogProducts) || catalogProducts.length === 0) return;

    setItems((prevItems) => {
      let hasChanges = false;
      const updated = prevItems
        .map((cartItem) => {
          const liveProduct = catalogProducts.find((p) => String(p.id) === String(cartItem.productId));
          if (!liveProduct) {
            // El producto ya no existe en el catálogo
            hasChanges = true;
            return { ...cartItem, isOrphan: true };
          }

          const liveStock = Number(liveProduct.stock);
          const livePrice = Number(liveProduct.price);
          const adjustedQuantity = liveStock <= 0 ? 0 : Math.min(cartItem.quantity, liveStock);

          if (
            cartItem.stock !== liveStock ||
            cartItem.price !== livePrice ||
            cartItem.quantity !== adjustedQuantity ||
            cartItem.isOrphan
          ) {
            hasChanges = true;
            return {
              ...cartItem,
              stock: liveStock,
              price: livePrice,
              quantity: adjustedQuantity,
              isOrphan: false,
            };
          }
          return cartItem;
        })
        .filter((item) => !item.isOrphan || item.quantity > 0);

      return hasChanges ? updated : prevItems;
    });
  }, []);

  // Promociones activas para liquidación
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    promotionService.getAll()
      .then((promos) => {
        if (isMounted && Array.isArray(promos)) {
          setPromotions(promos);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Métricas calculadas en memoria con liquidación de promociones y descuentos escalonados
   */
  const totals = useMemo(() => {
    const totalItems = items.length; // Cantidad de productos distintos
    const totalUnits = items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0); // Unidades totales
    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    
    // Liquidación de promociones y descuentos escalonados
    let discount = 0;
    let appliedPromotion = null;
    let progress = null;

    try {
      const { calculateCartDiscount, getPromotionProgress } = require ? {} : {};
    } catch {}

    // Descuentos escalonados por volumen
    if (subtotal >= 300000) {
      discount = (subtotal * 20) / 100;
      appliedPromotion = { name: 'Descuento por Volumen (20% OFF)', percent: 20 };
    } else if (subtotal >= 200000) {
      discount = (subtotal * 15) / 100;
      appliedPromotion = { name: 'Descuento por Volumen (15% OFF)', percent: 15 };
    } else if (subtotal >= 100000) {
      discount = (subtotal * 10) / 100;
      appliedPromotion = { name: 'Descuento por Volumen (10% OFF)', percent: 10 };
    }

    const shipping = subtotal > 0 ? (subtotal >= 80000 ? 0 : 7000) : 0;
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      totalItems,
      totalUnits,
      subtotal,
      discount,
      appliedPromotion,
      shipping,
      total,
      isFreeShipping: subtotal >= 80000 && subtotal > 0,
    };
  }, [items]);

  const getCartSubtotal = useCallback(() => totals.subtotal, [totals.subtotal]);
  const getCartDiscount = useCallback(() => totals.discount, [totals.discount]);
  const getCartTotal = useCallback(() => totals.total, [totals.total]);

  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = {
    items,
    totals,
    promotions,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncWithCatalog,
    getCartSubtotal,
    getCartDiscount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};

export default useCart;
