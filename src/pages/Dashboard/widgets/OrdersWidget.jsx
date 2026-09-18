import React from 'react';
import { Package, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters.js';
import { ORDER_STATUS_LABELS, ORDER_STATUS } from '../../../features/orders/services/orderService.js';

export const OrdersWidget = ({
  orders = [],
  title = 'Gestión de Pedidos',
  subtitle,
  canChangeStatus = false,
  onStatusChange,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case ORDER_STATUS.ENTREGADO:
        return { label: 'Entregado', icon: CheckCircle, className: 'badge-success' };
      case ORDER_STATUS.EN_CAMINO:
        return { label: 'En camino', icon: Truck, className: 'badge-info' };
      case ORDER_STATUS.PREPARANDO:
        return { label: 'En preparación', icon: Clock, className: 'badge-warning' };
      case ORDER_STATUS.CANCELADO:
        return { label: 'Cancelado', icon: AlertCircle, className: 'badge-danger' };
      default:
        return { label: 'Pendiente', icon: Package, className: 'badge-neutral' };
    }
  };

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="d-flex align-items-center gap-2">
          <Package size={20} className="text-primary" />
          <h3 className="widget-title">{title}</h3>
        </div>
        <span className="badge badge-neutral text-xs">{orders.length} pedidos registrados</span>
      </div>

      {subtitle && <p className="widget-subtitle mb-3">{subtitle}</p>}

      {orders.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <Package size={36} className="mb-2 text-muted" />
          <p>No se registran pedidos en este momento.</p>
        </div>
      ) : (
        <div className="orders-table-wrapper table-responsive">
          <table className="table-custom" style={{ minWidth: '780px' }}>
            <thead>
              <tr>
                <th style={{ width: '80px', whiteSpace: 'nowrap' }}>Código</th>
                <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Fecha</th>
                <th style={{ minWidth: '220px' }}>Cliente / Destino</th>
                <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Logística</th>
                <th style={{ width: '110px', whiteSpace: 'nowrap' }}>Items</th>
                <th style={{ width: '120px', whiteSpace: 'nowrap' }}>Total</th>
                <th style={{ width: '130px', whiteSpace: 'nowrap' }}>Estado</th>
                {canChangeStatus && <th style={{ width: '150px', whiteSpace: 'nowrap' }}>Acción</th>}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = getStatusBadge(order.status);
                const StatusIcon = statusInfo.icon;
                const isCold = Boolean(order.requiresColdChain);

                return (
                  <tr key={order.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong>#{order.id}</strong>
                    </td>
                    <td className="order-date-cell">{formatDate(order.createdAt)}</td>
                    <td>
                      <div className="customer-cell">
                        <span className="customer-name">{order.customerName}</span>
                        <small className="customer-loc text-muted">
                          {order.city} • {order.shippingAddress}
                        </small>
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {isCold ? (
                        <span className="badge text-xs" style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc', whiteSpace: 'nowrap' }}>
                          ❄️ Termoking
                        </span>
                      ) : (
                        <span className="badge badge-neutral text-xs" style={{ whiteSpace: 'nowrap' }}>
                          📦 Carga Seca
                        </span>
                      )}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className="badge badge-neutral text-xs">
                        {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <strong className="text-primary">{formatCurrency(order.total)}</strong>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span className={`badge ${statusInfo.className} d-inline-flex align-items-center gap-1 text-xs`} style={{ whiteSpace: 'nowrap' }}>
                        <StatusIcon size={12} />
                        <span>{statusInfo.label}</span>
                      </span>
                    </td>
                    {canChangeStatus && (
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <select
                          className="form-control form-control-sm text-xs status-select-dropdown"
                          value={order.status}
                          onChange={(e) => onStatusChange && onStatusChange(order.id, e.target.value)}
                        >
                          <option value={ORDER_STATUS.PENDIENTE}>Pendiente</option>
                          <option value={ORDER_STATUS.PREPARANDO}>En preparación</option>
                          <option value={ORDER_STATUS.EN_CAMINO}>En camino</option>
                          <option value={ORDER_STATUS.ENTREGADO}>Entregado</option>
                          <option value={ORDER_STATUS.CANCELADO}>Cancelado</option>
                        </select>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersWidget;
