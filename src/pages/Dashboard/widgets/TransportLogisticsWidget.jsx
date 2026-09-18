import React, { useState } from 'react';
import { 
  Truck, 
  ThermometerSnowflake, 
  Package, 
  MapPin, 
  Home, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Phone, 
  ShieldCheck,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters.js';
import { ORDER_STATUS, ORDER_STATUS_LABELS } from '../../../features/orders/services/orderService.js';

export const TransportLogisticsWidget = ({
  orders = [],
  onStatusChange,
}) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'cold', 'dry', 'pending', 'active'
  const [updatingId, setUpdatingId] = useState(null);

  const filteredOrders = orders.filter((order) => {
    if (filterType === 'cold') return Boolean(order.requiresColdChain);
    if (filterType === 'dry') return !order.requiresColdChain;
    if (filterType === 'pending') return order.status === ORDER_STATUS.PENDIENTE || order.status === ORDER_STATUS.PREPARANDO;
    if (filterType === 'active') return order.status === ORDER_STATUS.EN_CAMINO;
    return true;
  });

  const handleUpdate = async (orderId, nextStatus) => {
    setUpdatingId(orderId);
    try {
      if (onStatusChange) {
        await onStatusChange(orderId, nextStatus);
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-widget-card transport-logistics-widget">
      <div className="widget-header d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div className="d-flex align-items-center gap-2">
          <Truck size={22} className="text-primary" />
          <div>
            <h3 className="widget-title mb-0">Rutas de Recolección en Finca y Despacho Urbano</h3>
            <p className="text-muted text-xs mb-0">
              Operador Logístico: <strong>Transportes AgroExpress</strong> • Flota Rural y Cadena de Frío
            </p>
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="d-flex align-items-center gap-1 flex-wrap">
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('all')}
          >
            Todos ({orders.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'cold' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('cold')}
          >
            ❄️ Frío ({orders.filter((o) => o.requiresColdChain).length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'dry' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('dry')}
          >
            📦 Seco ({orders.filter((o) => !o.requiresColdChain).length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'pending' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterType('pending')}
          >
            Pendientes ({orders.filter((o) => o.status === ORDER_STATUS.PENDIENTE || o.status === ORDER_STATUS.PREPARANDO).length})
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Truck size={40} className="mb-2 text-muted" />
          <p>No se registran despachos con el filtro seleccionado.</p>
        </div>
      ) : (
        <div className="logistics-routes-grid d-flex flex-column gap-3">
          {filteredOrders.map((order) => {
            const isCold = Boolean(order.requiresColdChain);
            const isUpdating = updatingId === order.id;

            return (
              <div 
                key={order.id} 
                className="logistics-route-card p-3 rounded"
                style={{
                  border: isCold ? '1px solid #bae6fd' : '1px solid #e5e7eb',
                  background: isCold ? 'rgba(240, 249, 255, 0.5)' : '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
              >
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <strong className="text-primary font-bold">Orden #{order.id}</strong>
                    <span className="text-muted text-xs">• {formatDate(order.createdAt)}</span>
                    {isCold ? (
                      <span 
                        className="badge text-xs d-inline-flex align-items-center gap-1"
                        style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc', fontWeight: 600 }}
                      >
                        <ThermometerSnowflake size={13} />
                        <span>Cadena de Frío (0°C a 4°C) • Termoking TRK-892</span>
                      </span>
                    ) : (
                      <span className="badge badge-neutral text-xs d-inline-flex align-items-center gap-1">
                        <Package size={13} />
                        <span>Carga Seca Campesina • Furgón AGR-441</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <span 
                      className={`badge text-xs ${
                        order.status === ORDER_STATUS.ENTREGADO 
                          ? 'badge-success' 
                          : order.status === ORDER_STATUS.EN_CAMINO 
                          ? 'badge-info' 
                          : order.status === ORDER_STATUS.PREPARANDO 
                          ? 'badge-warning' 
                          : 'badge-neutral'
                      }`}
                    >
                      {ORDER_STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                </div>

                {/* Ruta de origen y destino */}
                <div className="route-endpoints-grid d-grid gap-2 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                  {/* Origen: Finca Campesina */}
                  <div className="p-2 rounded bg-light" style={{ borderLeft: '3px solid #16a34a' }}>
                    <div className="d-flex align-items-center gap-1 text-xs text-muted mb-1">
                      <Home size={13} className="text-success" />
                      <strong>Punto de Recolección en Finca:</strong>
                    </div>
                    <div className="text-sm font-semibold">{order.originFarm || 'Finca Rural Certificada (Antioquia)'}</div>
                    <small className="text-muted text-xs">Despacho directo desde el productor</small>
                  </div>

                  {/* Destino: Cliente */}
                  <div className="p-2 rounded bg-light" style={{ borderLeft: '3px solid #0284c7' }}>
                    <div className="d-flex align-items-center gap-1 text-xs text-muted mb-1">
                      <MapPin size={13} className="text-primary" />
                      <strong>Destino Final del Cliente:</strong>
                    </div>
                    <div className="text-sm font-semibold">{order.customerName}</div>
                    <small className="text-muted text-xs">{order.shippingAddress}, {order.city}</small>
                  </div>
                </div>

                {/* Resumen de carga y liquidación de flete */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-2 rounded bg-muted text-xs mb-3">
                  <div>
                    <span className="text-muted">Carga: </span>
                    <strong>{Array.isArray(order.items) ? order.items.length : 0} referencias</strong>
                    <span className="text-muted"> (
                      {Array.isArray(order.items) 
                        ? order.items.map((it) => `${it.quantity}x ${it.name}`).slice(0, 2).join(', ')
                        : ''}
                      {Array.isArray(order.items) && order.items.length > 2 ? '...' : ''}
                    )</span>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <div>
                      <span className="text-muted">Flete Transporte: </span>
                      <strong className="text-success">{formatCurrency(order.shippingCost || (isCold ? 12500 : 8500))}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Comisión AgroConnect (6%): </span>
                      <strong>{formatCurrency(order.platformFee || Math.round((Number(order.subtotal) || 0) * 0.06))}</strong>
                    </div>
                  </div>
                </div>

                {/* Acciones de progresión de estado con sincronización en MockAPI */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 pt-2" style={{ borderTop: '1px dashed #e5e7eb' }}>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-xs text-muted">Cambio rápido:</span>
                    {order.status === ORDER_STATUS.PENDIENTE && (
                      <button
                        type="button"
                        className="btn btn-outline-warning btn-sm"
                        disabled={isUpdating}
                        onClick={() => handleUpdate(order.id, ORDER_STATUS.PREPARANDO)}
                      >
                        {isUpdating ? 'Actualizando MockAPI...' : '📦 Confirmar Recolección en Finca'}
                      </button>
                    )}
                    {order.status === ORDER_STATUS.PREPARANDO && (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        disabled={isUpdating}
                        onClick={() => handleUpdate(order.id, ORDER_STATUS.EN_CAMINO)}
                      >
                        {isUpdating ? 'Actualizando MockAPI...' : '🚚 Iniciar Ruta de Despacho'}
                      </button>
                    )}
                    {order.status === ORDER_STATUS.EN_CAMINO && (
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        disabled={isUpdating}
                        onClick={() => handleUpdate(order.id, ORDER_STATUS.ENTREGADO)}
                      >
                        {isUpdating ? 'Actualizando MockAPI...' : '✅ Confirmar Entrega al Cliente'}
                      </button>
                    )}
                    {order.status === ORDER_STATUS.ENTREGADO && (
                      <span className="text-success text-xs font-bold d-inline-flex align-items-center gap-1">
                        <CheckCircle2 size={14} /> Entrega Certificada en Destino
                      </span>
                    )}
                  </div>

                  <div className="d-flex align-items-center gap-1">
                    <label htmlFor={`status-select-${order.id}`} className="text-xs text-muted mb-0">
                      Estado MockAPI:
                    </label>
                    <select
                      id={`status-select-${order.id}`}
                      className="form-control form-control-sm text-xs"
                      style={{ width: 'auto' }}
                      value={order.status}
                      disabled={isUpdating}
                      onChange={(e) => handleUpdate(order.id, e.target.value)}
                    >
                      <option value={ORDER_STATUS.PENDIENTE}>Pendiente</option>
                      <option value={ORDER_STATUS.PREPARANDO}>En Finca (Acopio)</option>
                      <option value={ORDER_STATUS.EN_CAMINO}>En Ruta (Despacho)</option>
                      <option value={ORDER_STATUS.ENTREGADO}>Entregado</option>
                      <option value={ORDER_STATUS.CANCELADO}>Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransportLogisticsWidget;
