/**
 * Funciones utilitarias de formateo para la presentación de datos
 */

/**
 * Formatea un número como moneda colombiana (COP)
 * @param {number} amount
 * @returns {string} Ej: "$ 6.500"
 */
export const formatCurrency = (amount) => {
  const numeric = Number(amount) || 0;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numeric);
};

/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string} isoString
 * @returns {string} Ej: "13 de sep, 2026"
 */
export const formatDate = (isoString) => {
  if (!isoString) return 'Fecha no disponible';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
};

/**
 * Regla de negocio: la disponibilidad se deriva exclusivamente del stock físico.
 * stock > 0 => disponible
 * stock <= 0 => agotado
 * @param {number} stock
 * @returns {boolean}
 */
export const isAvailable = (stock) => {
  return Number(stock) > 0;
};
