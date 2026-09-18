import { USER_ROLES } from '../models/userModel.js';

/**
 * Catálogo Declarativo de Permisos
 */
export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_PRODUCTS: 'manage_products',
  MANAGE_PROMOTIONS: 'manage_promotions',
  MANAGE_CATEGORIES: 'manage_categories',
  MANAGE_ORDERS: 'manage_orders',
  MANAGE_INVENTORY: 'manage_inventory',
  VIEW_PRODUCTS: 'view_products',
  VIEW_ORDERS: 'view_orders',
  VIEW_CLIENTS: 'view_clients',
  VIEW_PRODUCTION: 'view_production',
  MANAGE_OWN_PRODUCTS: 'manage_own_products',
  BUY: 'buy',
  VIEW_LOGISTICS: 'view_logistics',
  UPDATE_DELIVERY_STATUS: 'update_delivery_status',
};

/**
 * Matriz de Permisos por Rol
 */
const ROLE_PERMISSIONS_MAP = {
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.MANAGE_PROMOTIONS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_PRODUCTION,
    PERMISSIONS.MANAGE_OWN_PRODUCTS,
    PERMISSIONS.BUY,
    PERMISSIONS.VIEW_LOGISTICS,
    PERMISSIONS.UPDATE_DELIVERY_STATUS,
  ],
  [USER_ROLES.CLIENTE]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS, // Solo pedidos propios
    PERMISSIONS.BUY,
  ],
  [USER_ROLES.EMPLEADO_INVENTARIO]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.MANAGE_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS, // Lectura para control de stock
  ],
  [USER_ROLES.EMPLEADO_PEDIDOS]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.VIEW_LOGISTICS,
    PERMISSIONS.UPDATE_DELIVERY_STATUS,
  ],
  [USER_ROLES.EMPLEADO_ATENCION]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.VIEW_CLIENTS,
    PERMISSIONS.MANAGE_PROMOTIONS, // Consulta y orientación en promociones
  ],
  [USER_ROLES.GANADERO_PORCINO]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.MANAGE_OWN_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTION,
    PERMISSIONS.VIEW_ORDERS, // Pedidos relacionados con sus productos
  ],
  [USER_ROLES.GANADERO_BOVINO]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.MANAGE_OWN_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTION,
    PERMISSIONS.VIEW_ORDERS, // Pedidos relacionados con sus productos
  ],
  [USER_ROLES.GANADERO_AVICOLA]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.MANAGE_OWN_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTION,
    PERMISSIONS.VIEW_ORDERS, // Pedidos relacionados con sus productos
  ],
  [USER_ROLES.AGRICULTOR]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.MANAGE_OWN_PRODUCTS,
    PERMISSIONS.VIEW_PRODUCTION,
    PERMISSIONS.VIEW_ORDERS, // Pedidos relacionados con sus cosechas
  ],
  [USER_ROLES.TRANSPORTADOR]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.VIEW_LOGISTICS,
    PERMISSIONS.UPDATE_DELIVERY_STATUS,
  ],
};

/**
 * Evalúa si un usuario cuenta con un permiso específico
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role || !user.active) return false;
  const userPerms = ROLE_PERMISSIONS_MAP[user.role] || [];
  return userPerms.includes(permission);
};

// Funciones semánticas reutilizables
export const canManageUsers = (user) => hasPermission(user, PERMISSIONS.MANAGE_USERS);
export const canManageProducts = (user) => hasPermission(user, PERMISSIONS.MANAGE_PRODUCTS);
export const canManagePromotions = (user) => hasPermission(user, PERMISSIONS.MANAGE_PROMOTIONS);
export const canManageCategories = (user) => hasPermission(user, PERMISSIONS.MANAGE_CATEGORIES);
export const canManageOrders = (user) => hasPermission(user, PERMISSIONS.MANAGE_ORDERS);
export const canManageInventory = (user) => hasPermission(user, PERMISSIONS.MANAGE_INVENTORY);
export const canViewAdminPanel = (user) => user?.role === USER_ROLES.ADMIN;
export const canBuy = (user) => hasPermission(user, PERMISSIONS.BUY);
export const canViewLogistics = (user) => hasPermission(user, PERMISSIONS.VIEW_LOGISTICS);
export const canUpdateDeliveryStatus = (user) => hasPermission(user, PERMISSIONS.UPDATE_DELIVERY_STATUS);

/**
 * Determina si un producto pertenece estrictamente al dominio de un usuario / rol productor.
 * Regla de negocio estricta:
 * - Ganadero Porcino: EXCLUSIVAMENTE carne de cerdo (NO MÁS, sin fruver ni hortalizas).
 * - Ganadero Bovino: EXCLUSIVAMENTE carne de res (NO MÁS, sin fruver ni hortalizas).
 * - Ganadero Avícola: EXCLUSIVAMENTE huevos y pollo (NO MÁS, sin fruver ni hortalizas).
 * - Agricultor: EXCLUSIVAMENTE frutas, verduras, hortalizas, tubérculos y café (NO MÁS, sin carnes).
 * - Admin y Empleado Inventario: Todo el catálogo.
 * - Demás roles: Ningún producto para control/edición.
 */
// Palabras clave agrícolas (frutas, verduras, hortalizas, tubérculos, plantas, hierbas, café, etc.)
const AGRI_TERMS = [
  'lechuga', 'tomate', 'cebolla', 'zanahoria', 'pimentón', 'pimenton', 'espinaca',
  'papa', 'yuca', 'arracacha', 'ñame', 'name', 'choclo', 'maíz', 'maiz', 'arveja',
  'fríjol', 'frijol', 'aguacate', 'mango', 'mora', 'lulo', 'maracuyá', 'maracuya',
  'uchuva', 'banano', 'plátano', 'platano', 'cilantro', 'albahaca', 'hierbabuena',
  'romero', 'café', 'cafe', 'panela', 'miel', 'fruta', 'verdura', 'hortaliza',
  'tubérculo', 'tuberculo', 'huerta', 'cosecha', 'francesa'
];

const BEEF_REGEX = /\b(res|reses|angus|punta de anca|lomo fino|solomito|churrasco|costilla de res|sobrebarriga|carne molida)\b/i;
const PORK_REGEX = /\b(cerdo|cerdos|porcino|porcina|bondiola|tocino|chicharr[oó]n|panceta|chuleta)\b/i;
const POULTRY_REGEX = /\b(huevo|huevos|pollo|pollos|pechuga|pechugas|pernil|perniles|muslo|muslos|gallina|alitas|av[ií]cola)\b/i;

export const isPorkProduct = (product) => {
  if (!product) return false;
  const name = (product.name || product.nombre || '').toLowerCase();
  const meat = (product.meatType || '').toLowerCase();

  // Si tiene meatType explícito
  if (meat === 'cerdo') return true;
  if (meat === 'res' || meat === 'avicola' || meat === 'pollo') return false;

  // Si es vegetal / fruta / huerta
  if (AGRI_TERMS.some((k) => name.includes(k))) return false;

  // Si coincide con términos de cerdo con frontera de palabra
  return PORK_REGEX.test(name);
};

export const isBeefProduct = (product) => {
  if (!product) return false;
  const name = (product.name || product.nombre || '').toLowerCase();
  const meat = (product.meatType || '').toLowerCase();

  // Si tiene meatType explícito
  if (meat === 'res') return true;
  if (meat === 'cerdo' || meat === 'avicola' || meat === 'pollo') return false;

  // Si es vegetal / fruta / huerta (evita falsos positivos como cilantro 'fresco')
  if (AGRI_TERMS.some((k) => name.includes(k))) return false;

  // Si coincide con términos de res con frontera de palabra
  return BEEF_REGEX.test(name);
};

export const isPoultryProduct = (product) => {
  if (!product) return false;
  const name = (product.name || product.nombre || '').toLowerCase();
  const meat = (product.meatType || '').toLowerCase();
  const cat = String(product.categoryId || product.categoria || '');

  if (meat === 'avicola' || meat === 'pollo') return true;
  if (meat === 'cerdo' || meat === 'res') return false;
  if (cat === '8') return true;

  if (AGRI_TERMS.some((k) => name.includes(k))) return false;

  return POULTRY_REGEX.test(name);
};

export const isAgriculturalProduct = (product) => {
  if (!product) return false;
  // Si pertenece a alguna categoría de carne o aves, nunca es agrícola
  if (isPorkProduct(product) || isBeefProduct(product) || isPoultryProduct(product)) {
    return false;
  }
  return true;
};

/**
 * Determina si un producto pertenece estrictamente al dominio de un usuario / rol productor.
 * Regla de negocio estricta:
 * - Ganadero Porcino: EXCLUSIVAMENTE carne de cerdo (NO MÁS, sin fruver ni hortalizas).
 * - Ganadero Bovino: EXCLUSIVAMENTE carne de res (NO MÁS, sin fruver ni hortalizas).
 * - Ganadero Avícola: EXCLUSIVAMENTE huevos y pollo (NO MÁS, sin fruver ni hortalizas).
 * - Agricultor: EXCLUSIVAMENTE frutas, verduras, hortalizas, tubérculos y café (NO MÁS, sin carnes).
 * - Admin y Empleado Inventario: Todo el catálogo.
 * - Demás roles: Ningún producto para control/edición.
 */
export const isProductInUserDomain = (user, product) => {
  if (!user || !user.active) return false;
  if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.EMPLEADO_INVENTARIO) return true;
  if (!product) return false;

  // 1. Ganadero Porcino (SOLO cerdo)
  if (user.role === USER_ROLES.GANADERO_PORCINO) {
    return isPorkProduct(product);
  }

  // 2. Ganadero Bovino (SOLO res)
  if (user.role === USER_ROLES.GANADERO_BOVINO) {
    return isBeefProduct(product);
  }

  // 3. Ganadero Avícola (SOLO pollo y huevos)
  if (user.role === USER_ROLES.GANADERO_AVICOLA) {
    return isPoultryProduct(product);
  }

  // 4. Agricultor (SOLO frutas, verduras, hortalizas, tubérculos, plátanos, café y huerta)
  if (user.role === USER_ROLES.AGRICULTOR) {
    return isAgriculturalProduct(product);
  }

  return false;
};

/**
 * Control estricto de propiedad y dominio ganadero:
 * Un ganadero solo puede editar productos que pertenezcan estrictamente a su línea (Cerdo, Res o Avícola).
 */
export const canManageOwnProducts = (user, product) => {
  if (!user || !user.active) return false;
  if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.EMPLEADO_INVENTARIO) return true;
  if (!hasPermission(user, PERMISSIONS.MANAGE_OWN_PRODUCTS)) return false;
  return isProductInUserDomain(user, product);
};

