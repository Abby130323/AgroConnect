import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../config/api.js';
import { INITIAL_FARMERS } from '../../utils/seedData.js';

/**
 * Normaliza los datos de un agricultor recibidos desde MockAPI (/cliente)
 */
const normalizeFarmer = (farmer) => {
  if (!farmer) return null;
  return {
    id: String(farmer.id),
    name: farmer.name || farmer.nombre || 'Agricultor Local',
    farmName: farmer.farmName || farmer.apellido || 'Finca Campesina',
    location: farmer.location || farmer.direccion || 'Colombia',
    phone: farmer.phone || farmer.telefono || '+57 300 000 0000',
    email: farmer.email || farmer.correo || 'contacto@agroconnect.co',
    avatar: farmer.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  };
};

/**
 * Servicio de Agricultores
 */
class FarmerService {
  constructor() {
    this.endpoint = API_ENDPOINTS.FARMERS;
    this._localCache = [...INITIAL_FARMERS];
  }

  async getAll() {
    try {
      const data = await httpClient.get(this.endpoint);
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeFarmer);
        this._localCache = normalized;
        return normalized;
      }
      return this._localCache;
    } catch (error) {
      console.warn(`[FarmerService] Usando directorio base para ${this.endpoint}:`, error.message);
      return this._localCache;
    }
  }

  async getById(id) {
    try {
      const data = await httpClient.get(`${this.endpoint}/${id}`);
      return normalizeFarmer(data);
    } catch (error) {
      const found = this._localCache.find(f => String(f.id) === String(id));
      if (found) return found;
      throw error;
    }
  }

  async create(farmerData) {
    const payload = {
      ...farmerData,
      nombre: farmerData.name || farmerData.nombre,
      name: farmerData.name || farmerData.nombre,
      apellido: farmerData.farmName || farmerData.apellido,
      farmName: farmerData.farmName || farmerData.apellido,
      direccion: farmerData.location || farmerData.direccion,
      location: farmerData.location || farmerData.direccion,
      telefono: farmerData.phone || farmerData.telefono,
      phone: farmerData.phone || farmerData.telefono,
      correo: farmerData.email || farmerData.correo,
      email: farmerData.email || farmerData.correo,
      avatar: farmerData.avatar,
      estado: true,
    };

    try {
      const created = await httpClient.post(this.endpoint, payload);
      const normalized = normalizeFarmer(created);
      this._localCache.push(normalized);
      return normalized;
    } catch (error) {
      const fallback = {
        ...farmerData,
        id: String(Date.now()),
      };
      this._localCache.push(fallback);
      return fallback;
    }
  }
}

export const farmerService = new FarmerService();
export default farmerService;
