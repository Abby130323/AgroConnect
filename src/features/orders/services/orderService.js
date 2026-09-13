import httpClient from '../../../services/http/httpClient.js';
import { API_ENDPOINTS } from '../../../config/api.js';

export const ORDER_STATUS = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  PREPARANDO: 'preparando',
  EN_CAMINO: 'en_camino',
  ENTREGADO: 'entregado',
  CANCELADO: 'cancelado',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDIENTE]: 'Pendiente de Confirmación',
  [ORDER_STATUS.CONFIRMADO]: 'Confirmado',
  [ORDER_STATUS.PREPARANDO]: 'En Preparación en Finca / Acopio',
  [ORDER_STATUS.EN_CAMINO]: 'En Despacho Logístico',
  [ORDER_STATUS.ENTREGADO]: 'Entregado al Destinatario',
  [ORDER_STATUS.CANCELADO]: 'Cancelado',
};

const normalizeOrder = (order) => {
  if (!order) return null;
  return {
    id: String(order.id),
    userId: order.userId ? String(order.userId) : null,
    customerName: order.customerName || order.cliente || 'Cliente General',
    customerEmail: order.customerEmail || order.correo || '',
    customerPhone: order.customerPhone || order.telefono || '',
    shippingAddress: order.shippingAddress || order.direccion || 'Dirección de entrega',
    city: order.city || order.ciudad || 'Medellín',
    items: Array.isArray(order.items) ? order.items : [],
    subtotal: Number(order.subtotal) || 0,
    discount: Number(order.discount) || 0,
    total: Number(order.total) || 0,
    status: order.status || order.estado_orden || ORDER_STATUS.PENDIENTE,
    createdAt: order.createdAt || new Date().toISOString(),
    notes: order.notes || '',
  };
};

export const orderService = {
  async getAll() {
    const raw = await httpClient.get(API_ENDPOINTS.ORDERS);
    return Array.isArray(raw) ? raw.map(normalizeOrder) : [];
  },

  async getById(id) {
    const raw = await httpClient.get(`${API_ENDPOINTS.ORDERS}/${id}`);
    return normalizeOrder(raw);
  },

  async getByUserId(userId) {
    const all = await this.getAll();
    return all.filter((o) => String(o.userId) === String(userId));
  },

  async create(orderData) {
    const payload = {
      userId: orderData.userId ? String(orderData.userId) : null,
      customerName: orderData.customerName,
      cliente: orderData.customerName,
      customerEmail: orderData.customerEmail,
      correo: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      city: orderData.city,
      items: orderData.items,
      subtotal: Number(orderData.subtotal),
      discount: Number(orderData.discount || 0),
      total: Number(orderData.total),
      status: orderData.status || ORDER_STATUS.PENDIENTE,
      estado_orden: orderData.status || ORDER_STATUS.PENDIENTE,
      createdAt: orderData.createdAt || new Date().toISOString(),
      notes: orderData.notes || '',
    };
    const created = await httpClient.post(API_ENDPOINTS.ORDERS, payload);
    return normalizeOrder(created);
  },

  async updateStatus(id, newStatus) {
    const payload = {
      status: newStatus,
      estado_orden: newStatus,
    };
    const updated = await httpClient.put(`${API_ENDPOINTS.ORDERS}/${id}`, payload);
    return normalizeOrder(updated);
  },

  async delete(id) {
    return await httpClient.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
  },
};

export default orderService;
