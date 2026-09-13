import React from 'react';
import { PackageSearch } from 'lucide-react';

export const EmptyState = ({
  icon: IconComponent = PackageSearch,
  title = 'No se encontraron registros',
  message = 'Intenta modificar los parámetros de búsqueda o limpiar los filtros seleccionados.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="empty-state-card" role="region" aria-label={title}>
      <div className="empty-state-icon-wrapper">
        <IconComponent size={48} className="text-muted" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="btn btn-outline-primary mt-3"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
