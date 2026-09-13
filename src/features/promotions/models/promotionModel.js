/**
 * Modelo y Tipos de Promoción para AgroConnect
 */

export const PROMOTION_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  TIER_DISCOUNT: 'tier_discount',
  DAY_OF_WEEK: 'day_of_week',
};

export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};

/**
 * Catálogo Inicial de Promociones Comerciales de AgroConnect
 */
export const INITIAL_PROMOTIONS = [
  // 1. Promoción Escalonada por Monto de Compra
  {
    id: 'promo-tier',
    name: 'Descuento Escalonado por Volumen Campesino',
    description: 'Ahorra entre 10% y 20% según el valor total de tu canasta',
    type: PROMOTION_TYPES.TIER_DISCOUNT,
    discountType: DISCOUNT_TYPES.PERCENTAGE,
    discountValue: 10,
    tiers: [
      { minAmount: 100000, discountPercent: 10, label: '10% de ahorro' },
      { minAmount: 200000, discountPercent: 15, label: '15% de ahorro' },
      { minAmount: 300000, discountPercent: 20, label: '20% de ahorro Máximo' },
    ],
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // Todos los días
    minPurchase: 100000,
    active: true,
    priority: 10,
    bannerTitle: 'Gran Ahorro por Volumen',
    bannerDescription: 'Lleva más de $100.000 en productos del campo y desbloquea hasta 20% de descuento directo.',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    bannerCta: 'Explorar Catálogo',
  },
  // 2. Lunes de Carnes
  {
    id: 'promo-lunes-carnes',
    name: 'Lunes de Carnes de Res Seleccionadas',
    description: '15% de descuento en todos los cortes de res de ganaderías sostenibles',
    type: PROMOTION_TYPES.DAY_OF_WEEK,
    discountType: DISCOUNT_TYPES.PERCENTAGE,
    discountValue: 15,
    daysOfWeek: [1], // 1 = Lunes
    categoryId: '7', // Carnes
    meatType: 'Res',
    minPurchase: 0,
    active: true,
    priority: 5,
    bannerTitle: 'Lunes de Carnes Premium',
    bannerDescription: '15% de descuento en Punta de Anca, Churrasco y Lomo Fino directo de ganadería.',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    bannerCta: 'Ver Cortes de Res',
  },
  // 3. Martes de Cerdo
  {
    id: 'promo-martes-cerdo',
    name: 'Martes de Cerdo Colombiano',
    description: '12% de descuento en Costilla BBQ, Bondiola y cortes porcinos',
    type: PROMOTION_TYPES.DAY_OF_WEEK,
    discountType: DISCOUNT_TYPES.PERCENTAGE,
    discountValue: 12,
    daysOfWeek: [2], // 2 = Martes
    categoryId: '7',
    meatType: 'Cerdo',
    minPurchase: 0,
    active: true,
    priority: 5,
    bannerTitle: 'Martes Parrillero de Cerdo',
    bannerDescription: 'Aprovecha cortes tiernos de cerdo con 12% de descuento directo.',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    bannerCta: 'Ver Cortes de Cerdo',
  },
  // 4. Miércoles de Frutas y Hortalizas
  {
    id: 'promo-miercoles-campo',
    name: 'Miércoles de Frutas y Huertas',
    description: '10% de descuento en frutas frescas deMarinilla y El Carmen',
    type: PROMOTION_TYPES.DAY_OF_WEEK,
    discountType: DISCOUNT_TYPES.PERCENTAGE,
    discountValue: 10,
    daysOfWeek: [3], // 3 = Miércoles
    categoryId: '1', // Frutas
    minPurchase: 0,
    active: true,
    priority: 5,
    bannerTitle: 'Miércoles de Cosecha Fresca',
    bannerDescription: 'Aguacates, mangos y fresas recién cosechadas con 10% de descuento.',
    bannerImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=1200&q=80',
    bannerCta: 'Ver Frutas Frescas',
  },
  // 5. Fin de Semana Campesino
  {
    id: 'promo-finde-campesino',
    name: 'Fin de Semana Campesino Familiar',
    description: 'Envío logístico gratis y $10.000 de descuento en compras superiores a $80.000',
    type: PROMOTION_TYPES.FIXED_AMOUNT,
    discountType: DISCOUNT_TYPES.FIXED,
    discountValue: 10000,
    daysOfWeek: [5, 6, 0], // Viernes, Sábado, Domingo
    minPurchase: 80000,
    active: true,
    priority: 8,
    bannerTitle: 'Fin de Semana Campesino',
    bannerDescription: '$10.000 de descuento en tu canasta del fin de semana por compras superiores a $80.000.',
    bannerImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
    bannerCta: 'Aprovechar Oferta',
  },
];
