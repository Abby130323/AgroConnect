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

/**
 * Determina si un producto pertenece estrictamente al dominio de un usuario / rol ganadero.
 * Regla de negocio:
 * - Ganadero Porcino: TODO lo relacionado a carne de cerdo NO MÁS.
 * - Ganadero Bovino: TODO lo relacionado a carne de res NO MÁS.
 * - Ganadero Avícola: TODO lo relacionado a huevos y pollo NO MÁS.
 * - Admin y Empleado Inventario: Todo el catálogo.
 * - Demás roles: Ningún producto para control/edición.
 */
export const isProductInUserDomain = (user, product) => {
  if (!user || !user.active) return false;
  if (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.EMPLEADO_INVENTARIO) return true;
  if (!product) return false;

  const pName = (product.name || '').toLowerCase();
  const pMeat = (product.meatType || '').toLowerCase();
  const catId = String(product.categoryId || product.categoria || '');

  if (user.role === USER_ROLES.GANADERO_PORCINO) {
    return (
      pMeat === 'cerdo' ||
      catId === '2' ||
      pName.includes('cerdo') ||
      pName.includes('bondiola') ||
      pName.includes('tocino') ||
      pName.includes('chicharrón') ||
      pName.includes('chicharron') ||
      pName.includes('panceta') ||
      pName.includes('chuleta de cerdo')
    );
  }

  if (user.role === USER_ROLES.GANADERO_BOVINO) {
    return (
      pMeat === 'res' ||
      catId === '1' ||
      catId === '7' ||
      pName.includes('res') ||
      pName.includes('angus') ||
      pName.includes('punta de anca') ||
      pName.includes('lomo fino') ||
      pName.includes('solomito') ||
      pName.includes('churrasco') ||
      pName.includes('costilla de res') ||
      pName.includes('sobrebarriga') ||
      pName.includes('carne molida')
    );
  }

  if (user.role === USER_ROLES.GANADERO_AVICOLA) {
    return (
      pMeat === 'avicola' ||
      pMeat === 'pollo' ||
      catId === '8' ||
      pName.includes('huevo') ||
      pName.includes('pollo') ||
      pName.includes('pechuga') ||
      pName.includes('pernil') ||
      pName.includes('muslo') ||
      pName.includes('gallina') ||
      pName.includes('alitas')
    );
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

