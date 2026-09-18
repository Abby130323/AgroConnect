import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../config/api.js';
import { INITIAL_PRODUCTS } from '../../utils/seedData.js';

const LOCAL_STORAGE_PRODUCTS_KEY = 'agroconnect_products_cache';

/**
 * Normaliza un producto proveniente de MockAPI (/producto)
 * Se establece que el modelo tenga por obligatorio { id, name, description, price, stock, categoryId, farmerId, imageUrl, unit, active }
 * más propiedades específicas de carnes (meatType, cut, weight, presentation, conservation).
 */
const normalizeProduct = (p) => {
  if (!p) return null;
  const stockNum = Number(p.stock !== undefined ? p.stock : 10);
  const img = p.imageUrl || p.image || p.imagen || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';

  return {
    id: String(p.id),
    name: p.name || p.nombre || 'Producto Comercial',
    description: p.description || p.descripcion || '',
    price: Number(p.price !== undefined ? p.price : p.precio) || 0,
    unit: p.unit || 'kg',
    stock: stockNum,
    imageUrl: img,
    image: img, // Compatibilidad
    categoryId: String(p.categoryId || p.categoria || '1'),
    farmerId: String(p.farmerId || '1'),
    active: p.active !== undefined ? Boolean(p.active) : stockNum > 0,
    meatType: p.meatType || null,
    cut: p.cut || null,
    weight: p.weight || null,
    presentation: p.presentation || null,
    conservation: p.conservation || null,
    refrigerated: p.refrigerated || false,
    frozen: p.frozen || false,
    createdAt: p.createdAt || new Date().toISOString(),
  };
};

/**
 * Prepara el cuerpo de la petición con campos en español e inglés para MockAPI
 */
const preparePayload = (productData) => {
  const name = productData.name || productData.nombre;
  const description = productData.description || productData.descripcion;
  const price = Number(productData.price !== undefined ? productData.price : productData.precio) || 0;
  const stock = Number(productData.stock !== undefined ? productData.stock : 0);
  const img = productData.imageUrl || productData.image || productData.imagen;
  const categoryId = String(productData.categoryId || productData.categoria || '1');
  const farmerId = String(productData.farmerId || '1');
  const unit = productData.unit || 'kg';

  return {
    nombre: name,
    name: name,
    descripcion: description,
    description: description,
    precio: price,
    price: price,
    stock: stock,
    imagen: img,
    imageUrl: img,
    image: img,
    categoria: categoryId,
    categoryId: categoryId,
    farmerId: farmerId,
    unit: unit,
    active: stock > 0,
    estado: stock > 0,
    meatType: productData.meatType || null,
    cut: productData.cut || null,
    weight: productData.weight || null,
    presentation: productData.presentation || null,
    conservation: productData.conservation || null,
    refrigerated: productData.refrigerated || false,
    frozen: productData.frozen || false,
    createdAt: productData.createdAt || new Date().toISOString(),
  };
};

/**
 * Servicio de Productos
 */
class ProductService {
  constructor() {
    this.endpoint = API_ENDPOINTS.PRODUCTS;
    this._loadInitialCache();
  }

  _loadInitialCache() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
      if (stored) {
        this._localCache = JSON.parse(stored);
        return;
      }
    } catch {
      // Ignorar error
    }
    this._localCache = [...INITIAL_PRODUCTS];
  }

  _persistCache() {
    try {
      localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(this._localCache));
    } catch {
      // Ignorar
    }
  }

  async getAll(params = {}) {
    try {
      const data = await httpClient.get(this.endpoint, params);
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeProduct);

        // Garantizar que las 3 líneas ganaderas (Cerdo, Res, Avícola)
        // estén siempre presentes en el catálogo
        const hasBeef = normalized.some(p => p.meatType === 'Res' || (p.name || '').toLowerCase().includes('punta de anca'));
        const hasPork = normalized.some(p => p.meatType === 'Cerdo' || (p.name || '').toLowerCase().includes('costilla de cerdo'));
        const hasPoultry = normalized.some(p => p.meatType === 'Avicola' || (p.name || '').toLowerCase().includes('huevo') || (p.name || '').toLowerCase().includes('pollo'));

        let combined = [...normalized];
        if (!hasBeef || !hasPork || !hasPoultry) {
          const missingSpecialized = INITIAL_PRODUCTS.filter(ip => {
            const isSpecial = ip.meatType === 'Res' || ip.meatType === 'Cerdo' || ip.meatType === 'Avicola';
            if (!isSpecial) return false;
            return !combined.some(cp => cp.name.toLowerCase() === ip.name.toLowerCase());
          });
          combined = [...missingSpecialized, ...combined];
        }

        this._localCache = combined;
        this._persistCache();
        return combined;
      }
      return this._localCache;
    } catch (error) {
      console.warn(`[ProductService] Usando catálogo local para ${this.endpoint}:`, error.message);
      return this._localCache;
    }
  }

  async getById(id) {
    try {
      const data = await httpClient.get(`${this.endpoint}/${id}`);
      return normalizeProduct(data);
    } catch (error) {
      const product = this._localCache.find(p => String(p.id) === String(id));
      if (product) return product;
      throw error;
    }
  }

  async create(productData) {
    const payload = preparePayload(productData);

    try {
      const created = await httpClient.post(this.endpoint, payload);
      const normalized = normalizeProduct(created);
      this._localCache = [normalized, ...this._localCache];
      this._persistCache();
      return normalized;
    } catch (error) {
      console.warn('[ProductService] Fallback local para CREATE', error.message);
      const fallback = normalizeProduct({
        ...payload,
        id: String(Date.now()),
      });
      this._localCache = [fallback, ...this._localCache];
      this._persistCache();
      return fallback;
    }
  }

  async update(id, productData) {
    const payload = preparePayload(productData);

    try {
      const updated = await httpClient.put(`${this.endpoint}/${id}`, payload);
      const normalized = normalizeProduct(updated);
      this._localCache = this._localCache.map(p => String(p.id) === String(id) ? normalized : p);
      this._persistCache();
      return normalized;
    } catch (error) {
      console.warn('[ProductService] Fallback local para UPDATE', error.message);
      const fallback = normalizeProduct({ ...payload, id: String(id) });
      this._localCache = this._localCache.map(p => String(p.id) === String(id) ? fallback : p);
      this._persistCache();
      return fallback;
    }
  }

  async delete(id) {
    try {
      const deleted = await httpClient.delete(`${this.endpoint}/${id}`);
      this._localCache = this._localCache.filter(p => String(p.id) !== String(id));
      this._persistCache();
      return deleted;
    } catch (error) {
      console.warn('[ProductService] Fallback local para DELETE', error.message);
      this._localCache = this._localCache.filter(p => String(p.id) !== String(id));
      this._persistCache();
      return { id };
    }
  }

  resetToInitial() {
    this._localCache = [...INITIAL_PRODUCTS];
    this._persistCache();
    return this._localCache;
  }
}

export const productService = new ProductService();
export default productService;
