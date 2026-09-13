import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters.js';

export const SalesWidget = ({
  orders = [],
  title = 'Métricas Comerciales y Ventas',
}) => {
  const totalSales = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const avgTicket = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
  const deliveredOrders = orders.filter((o) => o.status === 'entregado').length;

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="d-flex align-items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          <h3 className="widget-title">{title}</h3>
        </div>
        <span className="badge badge-success text-xs">Liquidación en Tiempo Real</span>
      </div>

      <div className="sales-metrics-grid mt-3">
        <div className="sales-metric-box">
          <DollarSign size={20} className="text-success mb-1" />
          <span className="sales-metric-val">{formatCurrency(totalSales)}</span>
          <span className="sales-metric-label">Facturación Bruta Consolidada</span>
        </div>

        <div className="sales-metric-box">
          <ShoppingCart size={20} className="text-primary mb-1" />
          <span className="sales-metric-val">{orders.length}</span>
          <span className="sales-metric-label">Órdenes Generadas</span>
        </div>

        <div className="sales-metric-box">
          <TrendingUp size={20} className="text-harvest-amber mb-1" />
          <span className="sales-metric-val">{formatCurrency(avgTicket)}</span>
          <span className="sales-metric-label">Ticket Promedio por Compra</span>
        </div>

        <div className="sales-metric-box">
          <Users size={20} className="text-info mb-1" />
          <span className="sales-metric-val">{deliveredOrders}</span>
          <span className="sales-metric-label">Despachos Finalizados</span>
        </div>
      </div>
    </div>
  );
};

export default SalesWidget;
