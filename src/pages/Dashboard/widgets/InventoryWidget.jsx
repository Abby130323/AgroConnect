import React, { useState } from 'react';
import { Layers, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters.js';

export const InventoryWidget = ({
  products = [],
  title = 'Control de Inventario y Stock',
  canUpdateStock = false,
  onStockUpdate,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [tempStock, setTempStock] = useState('');

  const outOfStock = products.filter((p) => Number(p.stock) <= 0);
  const lowStock = products.filter((p) => Number(p.stock) > 0 && Number(p.stock) <= 10);

  const handleStartEdit = (product) => {
    setEditingId(product.id);
    setTempStock(String(product.stock));
  };

  const handleSaveStock = async (product) => {
    const val = Number(tempStock);
    if (!isNaN(val) && val >= 0) {
      if (onStockUpdate) {
        await onStockUpdate(product.id, val);
      }
    }
    setEditingId(null);
  };

  return (
    <div className="dashboard-widget-card">
      <div className="widget-header">
        <div className="d-flex align-items-center gap-2">
          <Layers size={20} className="text-primary" />
          <h3 className="widget-title">{title}</h3>
        </div>
        <div className="d-flex gap-2">
          {outOfStock.length > 0 && (
            <span className="badge badge-danger text-xs">{outOfStock.length} Agotados</span>
          )}
          {lowStock.length > 0 && (
            <span className="badge badge-warning text-xs">{lowStock.length} Stock Crítico</span>
          )}
        </div>
      </div>

      <div className="inventory-table-wrapper table-responsive mt-3">
        <table className="table-custom" style={{ minWidth: '720px' }}>
          <thead>
            <tr>
              <th style={{ minWidth: '220px' }}>Producto</th>
              <th style={{ width: '160px', whiteSpace: 'nowrap' }}>Presentación</th>
              <th style={{ width: '120px', whiteSpace: 'nowrap' }}>Precio</th>
              <th style={{ width: '140px', whiteSpace: 'nowrap' }}>Existencias</th>
              <th style={{ width: '110px', whiteSpace: 'nowrap' }}>Estado</th>
              {canUpdateStock && <th style={{ width: '110px', whiteSpace: 'nowrap' }}>Gestión</th>}
            </tr>
          </thead>
          <tbody>
            {products.slice(0, 10).map((prod) => {
              const stockNum = Number(prod.stock);
              const isOut = stockNum <= 0;
              const isLow = stockNum > 0 && stockNum <= 10;

              return (
                <tr key={prod.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={prod.imageUrl || prod.image}
                        alt={prod.name}
                        className="inventory-thumb"
                      />
                      <div>
                        <strong className="d-block text-sm">{prod.name}</strong>
                        {prod.meatType && (
                          <small className="d-block text-muted text-xs">
                            {prod.meatType} • {prod.cut}
                          </small>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{prod.presentation || prod.unit || 'kg'}</td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{formatCurrency(prod.price)}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {editingId === prod.id ? (
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          value={tempStock}
                          onChange={(e) => setTempStock(e.target.value)}
                          className="form-control form-control-sm"
                          style={{ width: '70px' }}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm px-2"
                          onClick={() => handleSaveStock(prod)}
                        >
                          OK
                        </button>
                      </div>
                    ) : (
                      <strong>{prod.stock} {prod.unit}</strong>
                    )}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {isOut ? (
                      <span className="badge badge-danger text-xs">Agotado</span>
                    ) : isLow ? (
                      <span className="badge badge-warning text-xs">Crítico (≤10)</span>
                    ) : (
                      <span className="badge badge-success text-xs">Óptimo</span>
                    )}
                  </td>
                  {canUpdateStock && (
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {editingId !== prod.id && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleStartEdit(prod)}
                        >
                          <RefreshCw size={12} className="mr-1" />
                          <span>Ajustar</span>
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryWidget;
