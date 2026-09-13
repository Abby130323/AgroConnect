import { API_BASE_URL, DEFAULT_HEADERS } from '../../config/api.js';

/**
 * Cliente HTTP Genérico
 * 
 * Responsabilidades:
 * 1. Centralizar la URL base y construcción de peticiones.
 * 2. Unificar encabezados (Headers), serialización JSON y métodos REST.
 * 3. Interpretar códigos de estado HTTP y parsear respuestas JSON.
 * 4. Capturar y estandarizar errores de red y de servidor.
 * 
 * Durante una sustentación académica:
 * Este cliente demuestra el principio de responsabilidad única (SRP) y evita
 * repetir fetch() en múltiples partes de la aplicación. Si el backend cambia
 * (ej: de MockAPI a Express, Spring Boot o .NET), únicamente se modifica esta capa.
 */

class HttpError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Construye la URL completa agregando parámetros de búsqueda (query params) si existen.
 * @param {string} endpoint - Ruta relativa del recurso (ej: '/products')
 * @param {Object} [params] - Parámetros de consulta opcionales
 * @returns {string} URL completa
 */
const buildUrl = (endpoint, params = {}) => {
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = new URL(`${cleanBase}${cleanEndpoint}`);

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

/**
 * Ejecutor central de solicitudes fetch
 */
const request = async (endpoint, options = {}, params = {}) => {
  const url = buildUrl(endpoint, params);

  const config = {
    method: options.method || 'GET',
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Intentar parsear el cuerpo JSON de respuesta
    let responseData = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => '');
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    if (!response.ok) {
      const errorMessage = (responseData && typeof responseData === 'object' && responseData.message)
        ? responseData.message
        : `Error HTTP ${response.status}: ${response.statusText || 'Petición fallida'}`;

      throw new HttpError(errorMessage, response.status, responseData);
    }

    return responseData;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    // Errores de red (sin conexión a internet, CORS, timeout)
    throw new HttpError(
      `Error de red o conexión: ${error.message || 'No fue posible contactar al servidor'}`,
      0,
      null
    );
  }
};

export const httpClient = {
  /**
   * Petición GET: Obtención de recursos
   * @param {string} endpoint
   * @param {Object} [params]
   */
  get: (endpoint, params) => request(endpoint, { method: 'GET' }, params),

  /**
   * Petición POST: Creación de un nuevo recurso
   * @param {string} endpoint
   * @param {Object} body
   */
  post: (endpoint, body) => request(endpoint, { method: 'POST', body }),

  /**
   * Petición PUT: Actualización completa de un recurso
   * @param {string} endpoint
   * @param {Object} body
   */
  put: (endpoint, body) => request(endpoint, { method: 'PUT', body }),

  /**
   * Petición PATCH: Actualización parcial de un recurso
   * @param {string} endpoint
   * @param {Object} body
   */
  patch: (endpoint, body) => request(endpoint, { method: 'PATCH', body }),

  /**
   * Petición DELETE: Eliminación de un recurso
   * @param {string} endpoint
   */
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export { HttpError };
export default httpClient;
