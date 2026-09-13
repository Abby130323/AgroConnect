import httpClient from '../../../services/http/httpClient.js';
import { API_ENDPOINTS } from '../../../config/api.js';
import { INITIAL_PROMOTIONS } from '../models/promotionModel.js';

let localPromotionsMemory = [...INITIAL_PROMOTIONS];

export const promotionService = {
  async getAll() {
    try {
      const remote = await httpClient.get(API_ENDPOINTS.PROMOTIONS);
      if (Array.isArray(remote) && remote.length > 0) {
        return remote;
      }
    } catch {
      // Endpoint aún no aprovisionado en MockAPI dashboard, utilizar catálogo maestro
    }
    return localPromotionsMemory;
  },

  async getById(id) {
    try {
      return await httpClient.get(`${API_ENDPOINTS.PROMOTIONS}/${id}`);
    } catch {
      return localPromotionsMemory.find((p) => String(p.id) === String(id)) || null;
    }
  },

  async create(promoData) {
    try {
      return await httpClient.post(API_ENDPOINTS.PROMOTIONS, promoData);
    } catch {
      const newPromo = {
        ...promoData,
        id: `promo-${Date.now()}`,
        active: promoData.active ?? true,
      };
      localPromotionsMemory = [newPromo, ...localPromotionsMemory];
      return newPromo;
    }
  },

  async update(id, promoData) {
    try {
      return await httpClient.put(`${API_ENDPOINTS.PROMOTIONS}/${id}`, promoData);
    } catch {
      localPromotionsMemory = localPromotionsMemory.map((p) =>
        String(p.id) === String(id) ? { ...p, ...promoData } : p
      );
      return localPromotionsMemory.find((p) => String(p.id) === String(id));
    }
  },

  async delete(id) {
    try {
      return await httpClient.delete(`${API_ENDPOINTS.PROMOTIONS}/${id}`);
    } catch {
      localPromotionsMemory = localPromotionsMemory.filter((p) => String(p.id) !== String(id));
      return { success: true, id };
    }
  },
};

export default promotionService;
