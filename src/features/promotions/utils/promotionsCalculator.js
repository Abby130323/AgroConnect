import { PROMOTION_TYPES, DISCOUNT_TYPES } from '../models/promotionModel.js';

/**
 * Evalúa si una promoción se encuentra temporalmente activa hoy según la fecha y día real
 */
export const isPromotionActiveToday = (promo, targetDate = new Date()) => {
  if (!promo || !promo.active) return false;

  // 1. Validar rango de fechas si está definido
  if (promo.startDate) {
    const start = new Date(promo.startDate);
    if (targetDate < start) return false;
  }
  if (promo.endDate) {
    const end = new Date(promo.endDate);
    end.setHours(23, 59, 59, 999);
    if (targetDate > end) return false;
  }

  // 2. Validar día de la semana si corresponde
  if (Array.isArray(promo.daysOfWeek) && promo.daysOfWeek.length > 0) {
    const currentDay = targetDate.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    if (!promo.daysOfWeek.includes(currentDay)) {
      return false;
    }
  }

  return true;
};

/**
 * Calcula el subtotal bruto del carrito
 */
export const calculateSubtotal = (items = []) => {
  return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
};

/**
 * Evalúa el progreso hacia el siguiente nivel de descuento por volumen (Tier Discount)
 */
export const getPromotionProgress = (subtotal = 0) => {
  const tiers = [
    { target: 100000, discount: 10 },
    { target: 200000, discount: 15 },
    { target: 300000, discount: 20 },
  ];

  if (subtotal >= 300000) {
    return {
      currentDiscountPercent: 20,
      nextTierAmount: null,
      missingAmount: 0,
      percentage: 100,
      message: '¡Excelente! Has alcanzado el descuento máximo del 20% en toda tu orden.',
    };
  }

  if (subtotal >= 200000) {
    const missing = 300000 - subtotal;
    const progress = Math.min(100, Math.round(((subtotal - 200000) / 100000) * 100));
    return {
      currentDiscountPercent: 15,
      nextTierAmount: 300000,
      missingAmount: missing,
      percentage: progress,
      message: `Te faltan $${missing.toLocaleString('es-CO')} para desbloquear 20% de descuento máximo.`,
    };
  }

  if (subtotal >= 100000) {
    const missing = 200000 - subtotal;
    const progress = Math.min(100, Math.round(((subtotal - 100000) / 100000) * 100));
    return {
      currentDiscountPercent: 10,
      nextTierAmount: 200000,
      missingAmount: missing,
      percentage: progress,
      message: `Te faltan $${missing.toLocaleString('es-CO')} para desbloquear 15% de descuento.`,
    };
  }

  const missing = 100000 - subtotal;
  const progress = Math.min(100, Math.round((subtotal / 100000) * 100));
  return {
    currentDiscountPercent: 0,
    nextTierAmount: 100000,
    missingAmount: missing,
    percentage: progress,
    message: `Agrega $${missing.toLocaleString('es-CO')} para activar 10% de descuento en toda tu compra.`,
  };
};

/**
 * Calcula el descuento total aplicable al carrito, seleccionando el mejor beneficio
 * sin duplicar descuentos accidentalmente
 */
export const calculateCartDiscount = (items = [], promotions = []) => {
  const subtotal = calculateSubtotal(items);
  if (subtotal <= 0 || items.length === 0) {
    return {
      discountAmount: 0,
      appliedPromotion: null,
      finalTotal: 0,
    };
  }

  // 1. Calcular descuento por Tier de volumen
  const tierProgress = getPromotionProgress(subtotal);
  const tierDiscountAmount = (subtotal * tierProgress.currentDiscountPercent) / 100;

  // 2. Calcular promociones de día o categoría aplicables
  let bestItemDiscountAmount = 0;
  let bestItemPromotion = null;

  const activeDayPromos = promotions.filter((p) => isPromotionActiveToday(p));

  for (const promo of activeDayPromos) {
    if (promo.minPurchase && subtotal < promo.minPurchase) continue;

    let currentDiscount = 0;

    if (promo.type === PROMOTION_TYPES.FIXED_AMOUNT) {
      currentDiscount = Number(promo.discountValue) || 0;
    } else {
      // Aplicar a productos de su categoría o corte
      const eligibleItems = items.filter((item) => {
        if (promo.categoryId && String(item.categoryId) !== String(promo.categoryId)) return false;
        if (promo.meatType && item.meatType !== promo.meatType) return false;
        return true;
      });

      const eligibleSubtotal = calculateSubtotal(eligibleItems);
      currentDiscount = (eligibleSubtotal * (Number(promo.discountValue) || 0)) / 100;
    }

    if (currentDiscount > bestItemDiscountAmount) {
      bestItemDiscountAmount = currentDiscount;
      bestItemPromotion = promo;
    }
  }

  // 3. Regla de Prioridad y Mejor Beneficio:
  // Si el descuento escalonado por volumen supera al de producto específico, se aplica el escalonado
  if (tierDiscountAmount >= bestItemDiscountAmount && tierDiscountAmount > 0) {
    return {
      discountAmount: tierDiscountAmount,
      appliedPromotion: {
        id: 'promo-tier',
        name: `Descuento por Monto de Compra (${tierProgress.currentDiscountPercent}%)`,
        description: tierProgress.message,
      },
      finalTotal: subtotal - tierDiscountAmount,
    };
  }

  if (bestItemDiscountAmount > 0 && bestItemPromotion) {
    return {
      discountAmount: bestItemDiscountAmount,
      appliedPromotion: bestItemPromotion,
      finalTotal: subtotal - bestItemDiscountAmount,
    };
  }

  return {
    discountAmount: 0,
    appliedPromotion: null,
    finalTotal: subtotal,
  };
};

/**
 * Calcula el gran total liquidado con envío
 */
export const calculateTotal = (items = [], promotions = [], shipping = 0) => {
  const subtotal = calculateSubtotal(items);
  const { discountAmount, appliedPromotion } = calculateCartDiscount(items, promotions);
  const finalTotal = Math.max(0, subtotal - discountAmount + Number(shipping || 0));

  return {
    subtotal,
    discountAmount,
    shipping,
    finalTotal,
    appliedPromotion,
  };
};
