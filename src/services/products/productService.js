import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../config/api.js';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../../utils/seedData.js';

const LOCAL_STORAGE_PRODUCTS_KEY = 'agroconnect_products_cache';
/** Versión del esquema de caché: incrementar cuando cambie la estructura de datos */
const CACHE_VERSION_KEY = 'agroconnect_products_cache_v';
const CURRENT_CACHE_VERSION = '4';

/** IDs válidos de categoría (de INITIAL_CATEGORIES) para verificar integridad */
const VALID_CAT_IDS = new Set(INITIAL_CATEGORIES.map(c => String(c.id)));
/** Mapa nombre-de-producto → INITIAL_PRODUCT para reparar categoryId de datos de API */
const INITIAL_BY_NAME = new Map(
  INITIAL_PRODUCTS.map(ip => [ip.name.toLowerCase(), ip])
);

/**
 * Asigna la categoría canónica real a un producto según su nombre y tipo.
 * Garantiza consistencia absoluta entre la fuente de datos, el filtro y la tarjeta.
 */
export const resolveCanonicalCategoryId = (product) => {
  const name = (product?.name || product?.nombre || '').toLowerCase().trim();

  // 1. Frutas y Verduras de Temporada (Categoría 3)
  if (
    name.includes('mango') ||
    name.includes('uchuva') ||
    name.includes('banano') ||
    name.includes('aguacate') ||
    name.includes('mora de castilla') ||
    /\bmora\b/i.test(name) ||
    name.includes('lulo') ||
    name.includes('maracuyá') ||
    name.includes('maracuya')
  ) {
    return '3';
  }

  // 2. Tubérculos y Plátanos (Categoría 5)
  if (
    name.includes('cebolla') ||
    name.includes('zanahoria') ||
    name.includes('papa') ||
    name.includes('yuca') ||
    name.includes('plátano') ||
    name.includes('platano') ||
    name.includes('arracacha') ||
    name.includes('ñame') ||
    name.includes('name diamante')
  ) {
    return '5';
  }

  // 3. Verduras y Hortalizas (Categoría 4)
  if (
    name.includes('espinaca') ||
    name.includes('pimentón') ||
    name.includes('pimenton') ||
    name.includes('tomate') ||
    name.includes('lechuga') ||
    name.includes('cilantro') ||
    name.includes('arveja') ||
    name.includes('albahaca') ||
    name.includes('hierbabuena') ||
    name.includes('romero')
  ) {
    return '4';
  }

  // 4. Carnes de Res Seleccionadas (Categoría 1)
  if (
    product?.meatType === 'Res' ||
    name.includes('punta de anca') ||
    name.includes('lomo fino') ||
    name.includes('costilla de res') ||
    name.includes('sobrebarriga') ||
    name.includes('molida especial')
  ) {
    return '1';
  }

  // 5. Carnes de Cerdo Premium (Categoría 2)
  if (
    product?.meatType === 'Cerdo' ||
    name.includes('costilla de cerdo') ||
    name.includes('bondiola') ||
    name.includes('tocino') ||
    name.includes('chuleta de cerdo')
  ) {
    return '2';
  }

  // 6. Café y Despensa Artesanal (Categoría 6)
  if (
    name.includes('café') ||
    name.includes('cafe') ||
    name.includes('panela') ||
    name.includes('miel') ||
    name.includes('fríjol') ||
    name.includes('frijol') ||
    name.includes('choclo') ||
    name.includes('maíz') ||
    name.includes('maiz')
  ) {
    return '6';
  }

  // 7. Productos Avícolas (Categoría 8)
  if (
    product?.meatType === 'Avicola' ||
    name.includes('pollo') ||
    name.includes('huevo') ||
    name.includes('pechuga')
  ) {
    return '8';
  }

  // 8. Coincidencia en semillas locales
  const match = INITIAL_BY_NAME.get(name);
  if (match && match.categoryId) {
    return String(match.categoryId);
  }

  if (VALID_CAT_IDS.has(String(product?.categoryId || product?.categoria))) {
    return String(product.categoryId || product.categoria);
  }

  return '1';
};

/**
 * Normaliza un producto proveniente de MockAPI (/producto)
 * Se establece que el modelo tenga por obligatorio { id, name, description, price, stock, categoryId, farmerId, imageUrl, unit, active }
 * más propiedades específicas de carnes (meatType, cut, weight, presentation, conservation).
 */
const normalizeProduct = (p) => {
  if (!p) return null;
  const stockNum = Number(p.stock !== undefined ? p.stock : 10);
  const img = p.imageUrl || p.image || p.imagen || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80';
  const resolvedCategoryId = resolveCanonicalCategoryId(p);

  return {
    id: String(p.id),
    name: p.name || p.nombre || 'Producto Comercial',
    description: p.description || p.descripcion || '',
    price: Number(p.price !== undefined ? p.price : p.precio) || 0,
    unit: p.unit || 'kg',
    stock: stockNum,
    imageUrl: img,
    image: img, // Compatibilidad
    categoryId: resolvedCategoryId,
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
      const version = localStorage.getItem(CACHE_VERSION_KEY);
      if (version !== CURRENT_CACHE_VERSION) {
        // Caché desactualizado: limpiar y usar INITIAL_PRODUCTS como base
        localStorage.removeItem(LOCAL_STORAGE_PRODUCTS_KEY);
        localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
        this._localCache = [...INITIAL_PRODUCTS];
        return;
      }
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
      localStorage.setItem(CACHE_VERSION_KEY, CURRENT_CACHE_VERSION);
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

        // Asignar a cada producto su categoría canónica exacta
        const corrected = normalized.map(product => ({
          ...product,
          categoryId: resolveCanonicalCategoryId(product)
        }));

        // Garantizar que las 3 líneas ganaderas (Cerdo, Res, Avícola)
        // estén siempre presentes en el catálogo
        const hasBeef = corrected.some(p => p.meatType === 'Res' || (p.name || '').toLowerCase().includes('punta de anca'));
        const hasPork = corrected.some(p => p.meatType === 'Cerdo' || (p.name || '').toLowerCase().includes('costilla de cerdo'));
        const hasPoultry = corrected.some(p => p.meatType === 'Avicola' || (p.name || '').toLowerCase().includes('huevo') || (p.name || '').toLowerCase().includes('pollo'));

        let combined = [...corrected];
        if (!hasBeef || !hasPork || !hasPoultry) {
          const missingSpecialized = INITIAL_PRODUCTS.filter(ip => {
            const isSpecial = ip.meatType === 'Res' || ip.meatType === 'Cerdo' || ip.meatType === 'Avicola';
            if (!isSpecial) return false;
            return !combined.some(cp => cp.name.toLowerCase().trim() === ip.name.toLowerCase().trim());
          }).map(ip => ({
            ...ip,
            id: `seed-${ip.id}`,
            categoryId: resolveCanonicalCategoryId(ip)
          }));
          combined = [...combined, ...missingSpecialized];
        }

        // Deduplicar: nunca retornar el mismo producto dos veces por nombre
        const seenNames = new Set();
        const deduped = combined.filter(p => {
          const nameKey = (p.name || '').toLowerCase().trim();
          if (seenNames.has(nameKey)) return false;
          seenNames.add(nameKey);
          return true;
        });

        this._localCache = deduped;
        this._persistCache();
        return deduped;
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
