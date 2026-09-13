/**
 * Utilidad de persistencia para el Carrito de Compras en localStorage
 * Desacopla la API del navegador de los componentes y hooks.
 */

const STORAGE_KEY = 'agroconnect_cart_v1';

export const cartStorage = {
  /**
   * Recupera el carrito guardado en el navegador
   * @returns {Array} Arreglo de items del carrito
   */
  loadCart: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('[cartStorage] Error leyendo carrito de localStorage:', error);
      return [];
    }
  },

  /**
   * Guarda de forma inmutable el estado actual del carrito
   * @param {Array} cartItems
   */
  saveCart: (cartItems) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('[cartStorage] Error guardando carrito en localStorage:', error);
    }
  },

  /**
   * Limpia los datos del carrito almacenados
   */
  clearCart: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[cartStorage] Error limpiando carrito de localStorage:', error);
    }
  },
};

export default cartStorage;
