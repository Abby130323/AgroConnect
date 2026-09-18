/**
 * Configuración centralizada de la API REST
 * Sincronizada con los endpoints en español existentes en MockAPI
 */
export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : 'https://6aa6bb5ad7765db985078f3b.mockapi.io';

export const API_ENDPOINTS = {
  PRODUCTS: '/producto',
  CATEGORIES: '/categoria',
  FARMERS: '/cliente',
  USERS: '/usuario',
  ORDERS: '/orden',
  ORDER_STATUSES: '/estado_orden',
  INFORMATION: '/information',
  PROMOTIONS: '/promotions',
};

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
