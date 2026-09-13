import React from 'react';

export const LoadingState = ({
  message = 'Cargando datos del campo...',
  count = 6,
  type = 'cards', // 'cards' | 'spinner' | 'table'
}) => {
  if (type === 'spinner') {
    return (
      <div className="loading-state-container" role="status">
        <div className="spinner-large" aria-hidden="true" />
        <p className="loading-text">{message}</p>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="table-loading-skeleton" role="status" aria-label="Cargando tabla">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-table-row animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid" role="status" aria-label={message}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card animate-pulse">
          <div className="skeleton-img" />
          <div className="skeleton-body">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-meta" />
            <div className="skeleton-line skeleton-price" />
            <div className="skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingState;
