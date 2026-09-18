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
    items: Array.isArray(order.items) && order.items.length > 0 
      ? order.items 
      : (Array.isArray(order.detalle) ? order.detalle : []),
    subtotal: Number(order.subtotal) || 0,
    discount: Number(order.discount !== undefined ? order.discount : (order.descuento || 0)),
    total: Number(order.total) || 0,
    status: order.status || order.estado_orden || ORDER_STATUS.PENDIENTE,
    createdAt: order.createdAt || order.fecha || new Date().toISOString(),
    notes: order.notes || '',
    // Campos logísticos de transporte, cadena de frío y comisiones
    requiresColdChain: Boolean(order.requiresColdChain),
    transportType: order.transportType || (order.requiresColdChain ? 'Cadena de Frío (0°C a 4°C)' : 'Carga Seca / Carga General'),
    transportBadge: order.transportBadge || (order.requiresColdChain ? 'Refrigerado Termoking' : 'Furgón Ventilado'),
    originFarm: order.originFarm || 'Finca y Acopio Rural (Antioquia)',
    shippingCost: Number(order.shippingCost || (order.requiresColdChain ? 12500 : 8500)),
    platformFee: Number(order.platformFee || Math.round((Number(order.subtotal) || 0) * 0.06)),
    carrierName: order.carrierName || 'Transportes AgroExpress',
    carrierPhone: order.carrierPhone || '+57 315 889 4433',
    vehiclePlate: order.vehiclePlate || (order.requiresColdChain ? 'TRK-892 (Termoking)' : 'AGR-441 (Seco)'),
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
    const isCold = Boolean(orderData.requiresColdChain);
    const sub = Number(orderData.subtotal || 0);
    const ship = Number(orderData.shippingCost || (isCold ? 12500 : 8500));
    const fee = Number(orderData.platformFee || Math.round(sub * 0.06));

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
      detalle: orderData.items || [],
      subtotal: sub,
      discount: Number(orderData.discount || 0),
      descuento: Number(orderData.discount || 0),
      total: Number(orderData.total),
      metodo_pago: orderData.paymentMethod || 'PSE',
      paymentMethod: orderData.paymentMethod || 'PSE',
      status: orderData.status || ORDER_STATUS.PENDIENTE,
      estado_orden: orderData.status || ORDER_STATUS.PENDIENTE,
      createdAt: orderData.createdAt || new Date().toISOString(),
      fecha: orderData.createdAt || new Date().toISOString(),
      notes: orderData.notes || '',
      // Atributos de transporte y cadena de frío
      requiresColdChain: isCold,
      transportType: isCold ? 'Cadena de Frío (0°C a 4°C)' : 'Carga Seca / Carga General',
      transportBadge: isCold ? 'Refrigerado Termoking' : 'Furgón Ventilado',
      originFarm: orderData.originFarm || 'Fincas Campesinas de Origen',
      shippingCost: ship,
      platformFee: fee,
      carrierName: 'Transportes AgroExpress',
      carrierPhone: '+57 315 889 4433',
      vehiclePlate: isCold ? 'TRK-892 (Termoking)' : 'AGR-441 (Seco)',
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
