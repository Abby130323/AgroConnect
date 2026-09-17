import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../config/api.js';
import { INITIAL_CATEGORIES } from '../../utils/seedData.js';

/**
 * Normaliza una categoría recibida desde MockAPI (/categoria)
 */
const normalizeCategory = (cat) => {
  if (!cat) return null;
  return {
    id: String(cat.id),
    name: cat.name || cat.nombre || 'Categoría',
    description: cat.description || cat.descripcion || '',
    iconKey: cat.iconKey || 'vegetables',
  };
};

/**
 * Servicio de Categorías
 */
class CategoryService {
  constructor() {
    this.endpoint = API_ENDPOINTS.CATEGORIES;
    this._localCache = [...INITIAL_CATEGORIES];
  }

  async getAll() {
    try {
      const data = await httpClient.get(this.endpoint);
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeCategory);
        this._localCache = normalized;
        return normalized;
      }
      return this._localCache;
    } catch (error) {
      console.warn(`[CategoryService] Usando catálogo base para ${this.endpoint}:`, error.message);
      return this._localCache;
    }
  }

  async getById(id) {
    try {
      const data = await httpClient.get(`${this.endpoint}/${id}`);
      return normalizeCategory(data);
    } catch (error) {
      const found = this._localCache.find(c => String(c.id) === String(id));
      if (found) return found;
      throw error;
    }
  }

  async create(categoryData) {
    const payload = {
      ...categoryData,
      nombre: categoryData.name || categoryData.nombre,
      name: categoryData.name || categoryData.nombre,
      descripcion: categoryData.description || categoryData.descripcion,
      description: categoryData.description || categoryData.descripcion,
      iconKey: categoryData.iconKey || 'vegetables',
      estado: true,
    };

    try {
      const created = await httpClient.post(this.endpoint, payload);
      const normalized = normalizeCategory(created);
      this._localCache.push(normalized);
      return normalized;
    } catch (error) {
      const fallback = {
        ...categoryData,
        id: String(Date.now()),
      };
      this._localCache.push(fallback);
      return fallback;
    }
  }
}

export const categoryService = new CategoryService();
export default categoryService;
